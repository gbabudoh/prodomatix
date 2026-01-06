'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

type ReviewFormData = {
  rating: number;
  title: string;
  body: string;
  files?: FileList;
};

export default function ReviewForm({ productId, productName }: { productId: string, productName: string }) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, setValue, watch } = useForm<ReviewFormData>();
  const rating = watch('rating');

  const onSubmit = async (data: ReviewFormData) => {
    setIsSubmitting(true);
    try {
        // In a real app, we would upload images to S3/Cloudinary here first
        // and get back URLs to include in the review data.
        // const mediaUrls = await uploadImages(data.files);

        const response = await fetch('/api/reviews', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                productId,
                rating: data.rating,
                title: data.title,
                content: data.body,
                reviewerName: "Guest User", // Or get from session
                // mediaUrls, 
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to submit review');
        }

        console.log('Final Data:', data);
        setStep(4); // Success state
    } catch (error) {
        console.error("Submission error:", error);
        alert("Failed to submit review. Please try again.");
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-xl border border-zinc-100 dark:bg-zinc-900 dark:border-zinc-800">
      <div className="mb-6 text-center">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Review {productName}</h2>
        <div className="flex justify-center gap-1 mt-2">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="w-8 h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div className={`h-full bg-indigo-600 transition-all ${step >= s ? 'w-full' : 'w-0'}`} />
            </div>
          ))}
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-6 text-center">
          <p className="text-zinc-600 dark:text-zinc-400 font-medium">How would you rate this product?</p>
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button 
                key={star} 
                onClick={() => { setValue('rating', star); setStep(2); }}
                className={`text-4xl transition-colors ${rating >= star ? 'text-yellow-400' : 'text-zinc-200 dark:text-zinc-700'}`}
                type="button"
              >
                ★
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <input 
            {...register('title', { required: true })} 
            placeholder="Review Title" 
            className="w-full p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50" 
          />
          <textarea 
            {...register('body', { required: true })} 
            placeholder="Tell us more about your experience..." 
            rows={4} 
            className="w-full p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50" 
          />
          <button 
            onClick={() => setStep(3)} 
            type="button"
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Add a Photo or Video (Optional)</p>
          <div className="border-2 border-dashed border-zinc-200 dark:border-zinc-700 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors">
            <input type="file" multiple className="hidden" id="file-upload" {...register('files')} />
            <label htmlFor="file-upload" className="text-indigo-600 font-medium cursor-pointer">+ Upload Media</label>
          </div>
          <button 
            onClick={handleSubmit(onSubmit)} 
            disabled={isSubmitting}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      )}

      {step === 4 && (
        <div className="text-center py-10">
          <div className="text-5xl mb-4">🎉</div>
          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Thank You!</h3>
          <p className="text-zinc-500 text-sm">Your review has been submitted and is being processed by Prodomatix.</p>
        </div>
      )}
    </div>
  );
}
