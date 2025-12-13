import { createContext, useContext, useReducer, useEffect, ReactNode, useState } from 'react';
import { User } from '../types';
import { getApiService } from '../services/api';
import { AuthUtils } from '../utils/auth';
import { AppState } from '../types';

interface AuthState {
    currentUser: User | null;
    isAuthenticated: boolean;
    users: User[]; // Users list is still needed for mock auth
}

type AuthAction =
    | { type: 'LOGIN'; payload: { employeeId: string; ssnPrefix: string } }
    | { type: 'LOGOUT' }
    | { type: 'ADD_USER'; payload: Omit<User, 'id'> }
    | { type: 'UPDATE_USER'; payload: Partial<User> & { id: number } }
    | { type: 'DELETE_USER'; payload: number };

interface AuthContextType extends AuthState {
    login: (employeeId: string, ssnPrefix: string) => Promise<void>;
    logout: () => Promise<void>;
    addUser: (userData: Omit<User, 'id'>) => void;
    updateUser: (userData: Partial<User> & { id: number }) => void;
    deleteUser: (userId: number) => void;
    changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
    resetPassword: (employeeId: string, ssnSuffix: string, newPassword: string) => Promise<void>;
    forceResetPassword: (userId: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const initialState: AuthState = {
    currentUser: null,
    isAuthenticated: false,
    users: [
        {
            id: 1,
            employeeId: 'E001',
            username: 'admin',
            password: 'admin123',
            name: '시스템 관리자',
            department: 'IT',
            dept: 'IT',
            position: '관리자',
            role: 'ADMIN',
            isDepartmentHead: false,
            ssnPrefix: '900101',
            ssnSuffix: '1234567',
        },
        {
            id: 2,
            employeeId: 'E002',
            username: 'manager',
            password: 'manager123',
            name: '생산팀장',
            department: '생산',
            dept: '생산',
            position: '팀장',
            role: 'APPROVER',
            isDepartmentHead: true,
            ssnPrefix: '850215',
            ssnSuffix: '2345678',
        },
        {
            id: 3,
            employeeId: 'E003',
            username: 'user',
            password: 'user123',
            name: '품질팀원',
            department: '품질',
            dept: '품질',
            position: '사원',
            role: 'USER',
            isDepartmentHead: false,
            ssnPrefix: '920330',
            ssnSuffix: '3456789',
        },
    ],
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
    switch (action.type) {
        case 'LOGIN': {
            const user = state.users.find(u =>
                u.employeeId === action.payload.employeeId &&
                u.ssnPrefix === action.payload.ssnPrefix
            );
            if (user) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { password, ssnPrefix, ssnSuffix, ...userWithoutPassword } = user;
                return {
                    ...state,
                    currentUser: userWithoutPassword,
                    isAuthenticated: true,
                };
            }
            return state;
        }

        case 'LOGOUT':
            return {
                ...state,
                currentUser: null,
                isAuthenticated: false,
            };

        case 'ADD_USER':
            return {
                ...state,
                users: [...state.users, { ...action.payload, id: Date.now() }],
            };

        case 'UPDATE_USER':
            return {
                ...state,
                users: state.users.map(u =>
                    u.id === action.payload.id ? { ...u, ...action.payload } : u
                ),
            };

        case 'DELETE_USER':
            return {
                ...state,
                users: state.users.filter(u => u.id !== action.payload),
            };

        default:
            return state;
    }
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(authReducer, initialState);
    const apiService = getApiService();

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                if (AuthUtils.isAuthenticated()) {
                    const savedUser = AuthUtils.getCurrentUser();
                    if (savedUser) {
                        try {
                            // Try API check if available
                            const response = await apiService.getCurrentUser();
                            dispatch({
                                type: 'LOGIN',
                                payload: {
                                    employeeId: response.data.employeeId,
                                    ssnPrefix: response.data.ssnPrefix || '',
                                },
                            });
                        } catch (e) {
                            // Fallback to local
                            const fullUser = initialState.users.find(u => u.id === savedUser.id);
                            if (fullUser) {
                                dispatch({
                                    type: 'LOGIN',
                                    payload: { employeeId: fullUser.employeeId, ssnPrefix: fullUser.ssnPrefix || '' },
                                });
                            }
                        }
                    }
                }
            } catch (error) {
                console.error('Failed to initialize auth:', error);
            }
        };
        initializeAuth();
    }, []);

    useEffect(() => {
        if (state.isAuthenticated && state.currentUser) {
            AuthUtils.setCurrentUser(state.currentUser);
        } else {
            AuthUtils.removeCurrentUser();
        }
    }, [state.isAuthenticated, state.currentUser]);

    const login = async (employeeId: string, ssnPrefix: string) => {
        try {
            const response = await apiService.login(employeeId, ssnPrefix);
            AuthUtils.setToken(response.data.token);
            AuthUtils.setCurrentUser(response.data.user);
            dispatch({
                type: 'LOGIN',
                payload: { employeeId, ssnPrefix },
            });
        } catch (error) {
            const user = state.users.find(u =>
                u.employeeId === employeeId && u.ssnPrefix === ssnPrefix
            );
            if (user) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { password, ssnPrefix: _, ssnSuffix: __, ...userWithoutPassword } = user;
                AuthUtils.setToken(`mock-token-${user.id}`);
                AuthUtils.setCurrentUser(userWithoutPassword);
                dispatch({
                    type: 'LOGIN',
                    payload: { employeeId, ssnPrefix },
                });
            } else {
                throw new Error('Invalid credentials');
            }
        }
    };

    const logout = async () => {
        try {
            await apiService.logout();
        } catch (error) {
            console.error('Logout API error:', error);
        } finally {
            AuthUtils.logout();
            dispatch({ type: 'LOGOUT' });
        }
    };

    const addUser = (userData: Omit<User, 'id'>) => {
        dispatch({ type: 'ADD_USER', payload: userData });
    };

    const updateUser = (userData: Partial<User> & { id: number }) => {
        dispatch({ type: 'UPDATE_USER', payload: userData });
    };

    const deleteUser = (userId: number) => {
        dispatch({ type: 'DELETE_USER', payload: userId });
    };

    const changePassword = async (currentPassword: string, newPassword: string) => {
        if (!state.currentUser?.id) throw new Error('로그인이 필요합니다.');
        const user = state.users.find(u => u.id === state.currentUser?.id);
        if (!user || user.password !== currentPassword) {
            throw new Error('현재 비밀번호가 올바르지 않습니다.');
        }
        dispatch({
            type: 'UPDATE_USER',
            payload: { id: user.id, password: newPassword },
        });
    };

    const resetPassword = async (employeeId: string, ssnSuffix: string, newPassword: string) => {
        const user = state.users.find(u => u.employeeId === employeeId && u.ssnSuffix === ssnSuffix);
        if (!user) {
            throw new Error('사번 또는 주민등록번호 뒷자리가 올바르지 않습니다.');
        }
        dispatch({
            type: 'UPDATE_USER',
            payload: { id: user.id, password: newPassword },
        });
    };

    const forceResetPassword = (userId: number) => {
        dispatch({
            type: 'UPDATE_USER',
            payload: { id: userId, password: '1234' },
        });
    };

    return (
        <AuthContext.Provider value={{
            ...state,
            login,
            logout,
            addUser,
            updateUser,
            deleteUser,
            changePassword,
            resetPassword,
            forceResetPassword,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}
