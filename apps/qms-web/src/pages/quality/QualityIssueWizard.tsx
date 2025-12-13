import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { PageHeader, Card, Button, FormInput, FormTextarea, FormSelect } from '@repo/ui';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

const api = axios.create({ baseURL: 'http://localhost:3000' });

const STEPS = [
    { id: 'd0', title: 'D0: Containment' },
    { id: 'd1d3', title: 'D1-D3: Analysis' },
    { id: 'd4', title: 'D4: Root Cause' },
    { id: 'd5d8', title: 'D5-D8: Resolution' }
];

export default function QualityIssueWizard() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { id } = useParams();
    const [currentStep, setCurrentStep] = useState(0);

    // Form State
    const [formData, setFormData] = useState({
        issueNo: `8D-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
        title: '',
        description: '',
        status: 'OPEN',
        processStep: 'D0',
        d0Containment: '',
        d2Problem: '',
        d3Interim: '',
        d4RootCause: '',
        d5Corrective: '',
        d6Implement: '',
        d7Prevent: '',
        d8Congrat: ''
    });

    const mutation = useMutation({
        mutationFn: (data: any) => api.post('/qms/quality-issues', data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['quality-issues'] });
            navigate('/issues');
        }
    });

    const handleNext = () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            mutation.mutate(formData);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        } else {
            navigate('/issues');
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 0: // D0
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">D0: Symptom & Emergency Response</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormInput
                                label="Issue Number"
                                value={formData.issueNo}
                                onChange={(e: any) => setFormData({ ...formData, issueNo: e.target.value })}
                                required
                            />
                            <FormInput
                                label="Title"
                                value={formData.title}
                                onChange={(e: any) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>
                        <FormTextarea
                            label="Problem Description (Symptom)"
                            value={formData.description}
                            onChange={(e: any) => setFormData({ ...formData, description: e.target.value })}
                        />
                        <FormTextarea
                            label="D0: Immediate Containment Actions"
                            placeholder="What did you do immediately to stop the bleeding?"
                            value={formData.d0Containment}
                            onChange={(e: any) => setFormData({ ...formData, d0Containment: e.target.value })}
                        />
                    </div>
                );
            case 1: // D1-D3
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">D1-D3: Team & Problem Definition</h3>
                        <FormTextarea
                            label="D2: Detailed Problem Statement"
                            placeholder="5W2H Description"
                            value={formData.d2Problem}
                            onChange={(e: any) => setFormData({ ...formData, d2Problem: e.target.value })}
                        />
                        <FormTextarea
                            label="D3: Interim Containment Actions (ICA)"
                            placeholder="Short-term actions to protect the customer"
                            value={formData.d3Interim}
                            onChange={(e: any) => setFormData({ ...formData, d3Interim: e.target.value })}
                        />
                    </div>
                );
            case 2: // D4
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">D4: Root Cause Analysis</h3>
                        <FormTextarea
                            label="Root Cause (D4)"
                            rows={8}
                            placeholder="Result of 5 whys or Fishbone analysis..."
                            value={formData.d4RootCause}
                            onChange={(e: any) => setFormData({ ...formData, d4RootCause: e.target.value })}
                        />
                    </div>
                );
            case 3: // D5-D8
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">D5-D8: Permanent Correction & Closure</h3>
                        <FormTextarea
                            label="D5: Chosen Permanent Corrective Action (PCA)"
                            value={formData.d5Corrective}
                            onChange={(e: any) => setFormData({ ...formData, d5Corrective: e.target.value })}
                        />
                        <FormTextarea
                            label="D6: Implementation Validation"
                            value={formData.d6Implement}
                            onChange={(e: any) => setFormData({ ...formData, d6Implement: e.target.value })}
                        />
                        <FormTextarea
                            label="D7: Prevention of Recurrence"
                            value={formData.d7Prevent}
                            onChange={(e: any) => setFormData({ ...formData, d7Prevent: e.target.value })}
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <PageHeader
                title={id ? "Edit 8D Report" : "New 8D Report"}
                description={`Stage ${currentStep + 1}: ${STEPS[currentStep].title}`}
            />

            {/* Stepper */}
            <div className="flex items-center justify-between px-8 py-4 bg-white border rounded-lg mb-6">
                {STEPS.map((step, idx) => (
                    <div key={step.id} className="flex items-center">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 
                            ${idx <= currentStep ? 'border-brand-600 bg-brand-50 text-brand-600' : 'border-gray-300 text-gray-400'}`}>
                            {idx < currentStep ? <Check className="w-4 h-4" /> : idx + 1}
                        </div>
                        <span className={`ml-2 text-sm font-medium ${idx === currentStep ? 'text-gray-900' : 'text-gray-500'}`}>
                            {step.title}
                        </span>
                        {idx < STEPS.length - 1 && (
                            <div className="w-12 h-px bg-gray-300 mx-4" />
                        )}
                    </div>
                ))}
            </div>

            <Card className="p-6 min-h-[400px] flex flex-col justify-between">
                <div>
                    {renderStepContent()}
                </div>

                <div className="flex justify-between mt-8 pt-4 border-t">
                    <Button variant="secondary" onClick={handleBack}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        {currentStep === 0 ? 'Cancel' : 'Back'}
                    </Button>

                    <Button onClick={handleNext} disabled={mutation.isPending}>
                        {currentStep === STEPS.length - 1 ? (
                            <>Save & Submit <Check className="w-4 h-4 ml-2" /></>
                        ) : (
                            <>Next <ArrowRight className="w-4 h-4 ml-2" /></>
                        )}
                    </Button>
                </div>
            </Card>
        </div>
    );
}
