import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { Notification, Comment } from '../types';
import { useAuth } from './AuthContext';
import { api } from '../lib/api';

interface UIState {
    notifications: Notification[];
    comments: Comment[];
    // Include global UI states here (toasts, modals, etc.)
}

type UIAction =
    | { type: 'ADD_NOTIFICATION'; payload: Omit<Notification, 'id' | 'createdAt'> }
    | { type: 'SET_NOTIFICATIONS'; payload: Notification[] }
    | { type: 'MARK_NOTIFICATION_READ'; payload: number }
    | { type: 'MARK_ALL_NOTIFICATIONS_READ' }
    | { type: 'ADD_COMMENT'; payload: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'> }
    | { type: 'UPDATE_COMMENT'; payload: { id: number; content: string } }
    | { type: 'DELETE_COMMENT'; payload: number };

interface UIContextType extends UIState {
    addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
    markNotificationAsRead: (id: number) => void;
    markAllNotificationsAsRead: () => void;
    getUnreadNotificationCount: () => number;
    addComment: (comment: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>) => void;
    updateComment: (id: number, content: string) => void;
    deleteComment: (id: number) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

const initialState: UIState = {
    notifications: [],
    comments: [],
};

function uiReducer(state: UIState, action: UIAction): UIState {
    switch (action.type) {
        case 'ADD_NOTIFICATION':
            return {
                ...state,
                notifications: [
                    ...state.notifications,
                    {
                        id: Date.now(),
                        ...action.payload,
                        createdAt: new Date().toISOString(),
                    },
                ],
            };

        case 'SET_NOTIFICATIONS':
            return {
                ...state,
                notifications: action.payload,
            };

        case 'MARK_NOTIFICATION_READ':
            return {
                ...state,
                notifications: state.notifications.map(n =>
                    n.id === action.payload ? { ...n, isRead: true } : n
                ),
            };

        case 'MARK_ALL_NOTIFICATIONS_READ':
            return {
                ...state,
                notifications: state.notifications.map(n => ({ ...n, isRead: true })),
            };

        case 'ADD_COMMENT':
            return {
                ...state,
                comments: [
                    ...state.comments,
                    {
                        id: Date.now(),
                        ...action.payload,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                    },
                ],
            };

        case 'UPDATE_COMMENT':
            return {
                ...state,
                comments: state.comments.map(c =>
                    c.id === action.payload.id
                        ? { ...c, content: action.payload.content, updatedAt: new Date().toISOString() }
                        : c
                ),
            };

        case 'DELETE_COMMENT':
            return {
                ...state,
                comments: state.comments.filter(c => c.id !== action.payload),
            };

        default:
            return state;
    }
}

export function UIProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(uiReducer, initialState);
    const { currentUser } = useAuth();

    // Fetch notifications on mount and when user changes
    useEffect(() => {
        if (!currentUser?.id) return;

        const fetchNotifications = async () => {
            try {
                const res = await api.get(`/qms/notifications?userId=${currentUser.id}`);
                // Since our reducer adds one by one, we might need a SET_NOTIFICATIONS action or just reset.
                // For simplicity, let's assume we can just load them. 
                // Creating a new action type 'SET_NOTIFICATIONS' would be cleaner.
                dispatch({ type: 'SET_NOTIFICATIONS', payload: res.data });
            } catch (err) {
                console.error('Failed to fetch notifications', err);
            }
        };

        fetchNotifications();
        // Poll every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [currentUser]);

    const addNotification = async (notification: Omit<Notification, 'id' | 'createdAt'>) => {
        // Optimistic update
        const tempId = Date.now();
        dispatch({ type: 'ADD_NOTIFICATION', payload: notification });

        try {
            await api.post('/qms/notifications', notification);
            // In a real app we might replace the temp item with the real one, but for now this is fine.
        } catch (err) {
            console.error('Failed to send notification', err);
        }
    };

    const markNotificationAsRead = async (id: number) => {
        dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id });
        try {
            await api.post(`/qms/notifications/${id}/read`);
        } catch (err) {
            console.error('Failed to mark read', err);
        }
    };

    const markAllNotificationsAsRead = async () => {
        if (!currentUser?.id) return;
        dispatch({ type: 'MARK_ALL_NOTIFICATIONS_READ' });
        try {
            await api.post('/qms/notifications/read-all', { userId: currentUser.id });
        } catch (err) {
            console.error('Failed to mark all read', err);
        }
    };

    const getUnreadNotificationCount = () => {
        if (!currentUser?.id) return 0;
        return state.notifications.filter(
            n => n.userId === currentUser.id && !n.isRead
        ).length;
    };

    const addComment = (comment: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>) => {
        if (!currentUser?.id) return;
        dispatch({
            type: 'ADD_COMMENT',
            payload: { ...comment, userId: currentUser.id },
        });
    };

    const updateComment = (id: number, content: string) => {
        dispatch({ type: 'UPDATE_COMMENT', payload: { id, content } });
    };

    const deleteComment = (id: number) => {
        dispatch({ type: 'DELETE_COMMENT', payload: id });
    };

    return (
        <UIContext.Provider value={{
            ...state,
            addNotification,
            markNotificationAsRead,
            markAllNotificationsAsRead,
            getUnreadNotificationCount,
            addComment,
            updateComment,
            deleteComment,
        }}>
            {children}
        </UIContext.Provider>
    );
}

export function useUI() {
    const context = useContext(UIContext);
    if (!context) {
        throw new Error('useUI must be used within UIProvider');
    }
    return context;
}
