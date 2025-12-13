import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { PageHeader, Card, Button, FormInput, FormSelect } from '@repo/ui';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

const api = axios.create({ baseURL: 'http://localhost:3000' });

const STEPS = [
    { id: 'info', title: 'Project Info' },
    { id: 'checklist', title: 'Requirements' },
    { id: 'review', title: 'Review & Submit' }
];

export default function PpapWizard() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { id } = useParams();
    const [currentStep, setCurrentStep] = useState(0);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        customer: '',
        submissionLevel: 3,
        status: 'DRAFT'
    });

    const mutation = useMutation({
        mutationFn: (data: any) => api.post('/qms/ppap', data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ppap'] });
            navigate('/ppap');
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
            navigate('/ppap');
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 0: // Project Info
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Basic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormInput
                                label="Project Title / Part Name"
                                value={formData.title}
                                onChange={(e: any) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                            <FormInput
                                label="Customer Name"
                                value={formData.customer}
                                onChange={(e: any) => setFormData({ ...formData, customer: e.target.value })}
                                required
                            />
                            <FormSelect
                                label="Submission Level"
                                value={formData.submissionLevel}
                                onChange={(val: any) => setFormData({ ...formData, submissionLevel: Number(val) })}
                                options={[
                                    { value: 1, label: 'Level 1: PSW Only' },
                                    { value: 2, label: 'Level 2: PSW + Limited Samples' },
                                    { value: 3, label: 'Level 3: PSW + Samples + Full Data (Default)' },
                                    { value: 4, label: 'Level 4: PSW + User Defined' },
                                    { value: 5, label: 'Level 5: On-site Review' },
                                ]}
                            />
                        </div>
                    </div>
                );
            case 1: // Checklist (Mocked based on Level)
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Required Documents (Level {formData.submissionLevel})</h3>
                        <div className="border rounded-md p-4 bg-gray-50 text-sm text-gray-600">
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Part Submission Warrant (PSW)</li>
                                {formData.submissionLevel >= 2 && <li>Design Records</li>}
                                {formData.submissionLevel >= 3 && <li>Process FMEA</li>}
                                {formData.submissionLevel >= 3 && <li>Control Plan</li>}
                                {formData.submissionLevel >= 3 && <li>Measurement System Analysis (MSA)</li>}
                            </ul>
                            <p className="mt-4 italic text-xs text-gray-500">
                                * File upload functionality will be enabled after saving the draft.
                            </p>
                        </div>
                    </div>
                );
            case 2: // Review
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Summary</h3>
                        <div className="bg-white p-4 border rounded shadow-sm">
                            <dl className="grid grid-cols-2 gap-4 text-sm">
                                <dt className="text-gray-500">Title</dt>
                                <dd className="font-medium">{formData.title}</dd>

                                <dt className="text-gray-500">Customer</dt>
                                <dd className="font-medium">{formData.customer}</dd>

                                <dt className="text-gray-500">Level</dt>
                                <dd className="font-medium">Level {formData.submissionLevel}</dd>
                            </dl>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <PageHeader
                title={id ? "Edit PPAP" : "New PPAP Submission"}
                description={`Step ${currentStep + 1} of ${STEPS.length}: ${STEPS[currentStep].title}`}
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
