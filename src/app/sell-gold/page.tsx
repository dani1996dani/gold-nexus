'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { leadSchema, LeadFormValues } from '@/lib/zod-schemas/leadSchema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import { CountryDropdown, Country } from '@/components/ui/country-dropdown';
import { countries } from 'country-data-list';
import { FileUploader } from '@/components/ui/file-uploader';
import { Karat } from '@/generated/prisma/client';

export default function SellGoldPage() {
  const [submissionState, setSubmissionState] = useState<{
    status: 'idle' | 'submitting' | 'success' | 'error';
    message: string | null;
  }>({ status: 'idle', message: null });
  
  const [karats, setKarats] = useState<Karat[]>([]);
  const uploadFilesRef = useRef<File[]>([]);

  useEffect(() => {
    const fetchKarats = async () => {
      try {
        const res = await fetch('/api/karats');
        if (!res.ok) throw new Error('Failed to fetch karats');
        const data = await res.json();
        setKarats(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchKarats();
  }, []);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phoneNumber: '',
      country: '',
      city: '',
      itemType: '',
      estimatedKarat: '',
      estimatedWeight: '',
      photoUrls: [],
    },
  });

  const onSubmit = async (data: LeadFormValues) => {
    const files = uploadFilesRef.current;
    
    setSubmissionState({ status: 'submitting', message: 'Uploading images...' });

    try {
      const photoUrls: string[] = [];

      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);

        const uploadRes = await fetch('/api/leads/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadRes.ok) {
          let errorMessage = `Upload failed (${uploadRes.status})`;
          try {
            const errorData = await uploadRes.json();
            errorMessage = errorData.message || errorMessage;
          } catch (e) {
            // If not JSON, it might be an HTML error page from Next.js
            const text = await uploadRes.text();
            console.error('Non-JSON error response:', text);
          }
          throw new Error(errorMessage);
        }

        const data = await uploadRes.json();
        photoUrls.push(data.url);
      }
      
      setSubmissionState({ status: 'submitting', message: 'Submitting inquiry...' });

      // The 'data' from onSubmit doesn't include the real URLs, so we build the final payload.
      const submissionData = { 
        ...data, 
        photoUrls: photoUrls // Override with the real URLs
      };

      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'An unknown error occurred.');
      }

      setSubmissionState({
        status: 'success',
        message: 'Your inquiry has been submitted successfully! We will contact you shortly.',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to submit inquiry.';
      setSubmissionState({ status: 'error', message });
    }
  };

  if (submissionState.status === 'success') {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <CheckCircle className="h-16 w-16 text-green-500" />
        <h1 className="mt-4 font-serif text-3xl font-medium">Thank You!</h1>
        <p className="mt-2 max-w-md text-neutral-600">{submissionState.message}</p>
        <Button onClick={() => window.location.reload()} className="mt-6">Submit Another Inquiry</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#F9F9F9] px-4 py-12 sm:px-6 lg:py-20">
      <main className="mx-auto max-w-2xl">
        <div className="text-center">
          <h1 className="font-serif text-4xl font-medium text-black sm:text-5xl">Sell Your Gold</h1>
          <p className="mx-auto mt-4 max-w-xl text-neutral-600">
            Submit your gold details below and our specialists will provide you with a competitive
            quote shortly.
          </p>
        </div>

        <Card className="mt-10 border-neutral-200 bg-white shadow-none sm:mt-12">
          <CardHeader>
            <CardTitle className="font-sans text-xl font-semibold">Inquiry Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Controller name="fullName" control={control} render={({ field }) => <Input id="fullName" {...field} className="mt-1.5" />} />
                  {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName.message}</p>}
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Controller name="email" control={control} render={({ field }) => <Input id="email" type="email" {...field} className="mt-1.5" />} />
                  {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                </div>
                <div>
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Controller name="phoneNumber" control={control} render={({ field }) => <Input id="phoneNumber" {...field} className="mt-1.5" />} />
                  {errors.phoneNumber && <p className="mt-1 text-xs text-red-500">{errors.phoneNumber.message}</p>}
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Controller
                    name="country"
                    control={control}
                    render={({ field }) => (
                      <div className="mt-1.5">
                        <CountryDropdown
                          value={countries.all.find(c => c.name === field.value)}
                          onChange={(country: Country) => field.onChange(country.name)}
                        />
                      </div>
                    )}
                  />
                  {errors.country && <p className="mt-1 text-xs text-red-500">{errors.country.message}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="city">City</Label>
                <Controller name="city" control={control} render={({ field }) => <Input id="city" {...field} className="mt-1.5" />} />
                {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city.message}</p>}
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <Label htmlFor="itemType">Item Type</Label>
                  <Controller
                    name="itemType"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select item type" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Gold Bar">Gold Bar</SelectItem>
                          <SelectItem value="Gold Coin">Gold Coin</SelectItem>
                          <SelectItem value="Jewelry">Jewelry</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.itemType && <p className="mt-1 text-xs text-red-500">{errors.itemType.message}</p>}
                </div>
                <div>
                  <Label htmlFor="estimatedKarat">Estimated Karat</Label>
                   <Controller
                    name="estimatedKarat"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value} disabled={karats.length === 0}>
                        <SelectTrigger className="mt-1.5"><SelectValue placeholder={karats.length > 0 ? "Select karat" : "Loading..."} /></SelectTrigger>
                        <SelectContent>
                          {karats.map(k => (
                            <SelectItem key={k.id} value={k.name}>{k.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.estimatedKarat && <p className="mt-1 text-xs text-red-500">{errors.estimatedKarat.message}</p>}
                </div>
              </div>
              
              <div>
                <Label htmlFor="estimatedWeight">Estimated Weight (in grams)</Label>
                <Controller name="estimatedWeight" control={control} render={({ field }) => <Input id="estimatedWeight" placeholder="e.g., 100" {...field} className="mt-1.5" />} />
                {errors.estimatedWeight && <p className="mt-1 text-xs text-red-500">{errors.estimatedWeight.message}</p>}
              </div>
              
              <div>
                <Label>Photo Upload</Label>
                <Controller
                  name="photoUrls"
                  control={control}
                  render={({ field }) => (
                    <div className="mt-1.5">
                      <FileUploader
                        onFilesChange={(files) => {
                          // Update the ref for the actual upload process
                          uploadFilesRef.current = files;
                          // Update the form field with dummy data (file names) for validation
                          field.onChange(files.map(file => file.name));
                        }}
                        maxFiles={10}
                      />
                    </div>
                  )}
                />
                {errors.photoUrls && <p className="mt-1 text-xs text-red-500">{errors.photoUrls.message}</p>}
              </div>

              {submissionState.status === 'error' && (
                <div className="flex items-center gap-2 rounded-md bg-red-50 p-3 text-red-700">
                  <AlertTriangle className="h-5 w-5" />
                  <p className="text-sm font-medium">{submissionState.message}</p>
                </div>
              )}

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={submissionState.status === 'submitting'}
                  className="w-full rounded-md bg-black py-6 text-base font-semibold text-white hover:bg-neutral-800"
                >
                  {submissionState.status === 'submitting' ? submissionState.message : 'Submit Inquiry'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
