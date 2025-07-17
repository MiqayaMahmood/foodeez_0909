import Image from "next/image";
import React from "react";
import Input from "../Input";
import { Plus } from "lucide-react";

interface FoodJourneyFormProps {
  form: {
    TITLE: string;
    DESCRIPTION: string;
    RESTAURANT_NAME: string;
    ADDRESS_GOOGLE_URL: string;
    images: File[];
  };
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (idx: number) => void;
  imagePreviews: string[];
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
  error: string;
  success: string;
}

const FoodJourneyForm: React.FC<FoodJourneyFormProps> = ({
  form,
  onInputChange,
  onImageChange,
  onRemoveImage,
  imagePreviews,
  onSubmit,
  submitting,
  error,
  success,
}) => {
  return (
    <div className="border border-primary  rounded-2xl p-4 lg:p-8 bg-primary/10">
      <form
        onSubmit={onSubmit}
        className="bg-white rounded-2xl shadow-lg p-4 sm:p-10 space-y-6"
      >
        <div className="space-y-10">
          {/* Title */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Title</label>
            <Input
              type="text"
              name="TITLE"
              value={form.TITLE}
              onChange={onInputChange}
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="E.g : Shawarma in Switzerland? This One Changed the Game"
              required
            />
          </div>

          {/* Restaurant Name */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Restaurant Name</label>
            <Input
              type="text"
              name="RESTAURANT_NAME"
              value={form.RESTAURANT_NAME}
              onChange={onInputChange}
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* Google Maps URL */}
          <div className="flex flex-col md:col-span-2">
            <label className="font-semibold mb-1">
              Google Maps URL <span className="text-gray-500">(optional)</span>
            </label>
            <Input
              type="url"
              name="ADDRESS_GOOGLE_URL"
              value={form.ADDRESS_GOOGLE_URL}
              onChange={onInputChange}
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col md:col-span-2">
            <label className="font-semibold mb-1">Description</label>
            <textarea
              name="DESCRIPTION"
              value={form.DESCRIPTION}
              onChange={onInputChange}
              rows={5}
              className="border border-gray-300 rounded-md px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* Image Upload */}
          <div className="flex flex-col md:col-span-2">
            <label className="font-semibold mb-1">
              Upload Images (up to 3)
            </label>
            <div className="flex gap-4">
              {[0, 1, 2].map((idx) => (
                <div key={idx} className="relative group w-24 h-36 bg-gray-100 rounded-xl flex items-center justify-center shadow-md overflow-hidden">
                  {imagePreviews[idx] ? (
                    <>
                      <Image
                        src={imagePreviews[idx]}
                        alt={`Preview ${idx + 1}`}
                        className="object-cover w-full h-full rounded-xl"
                        width={200}
                        height={300}
                        style={{ aspectRatio: '3/4' }}
                      />
                      <button
                        type="button"
                        onClick={() => onRemoveImage(idx)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow"
                        aria-label="Remove image"
                      >
                        &times;
                      </button>
                    </>
                  ) : (
                    <label htmlFor={`food-journey-image-${idx}`} className="flex flex-col items-center justify-center w-full h-full cursor-pointer text-gray-400 hover:text-primary transition-colors">
                      <Plus />
                      <span className="text-xs">Add Photo</span>
                      <input
                        id={`food-journey-image-${idx}`}
                        type="file"
                        accept="image/*"
                        onChange={onImageChange}
                        className="hidden"
                        disabled={imagePreviews.length >= 3}
                      />
                    </label>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && <div className="text-red-600 font-medium">{error}</div>}
        {success && <div className="text-green-600 font-medium">{success}</div>}

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-3 rounded-lg transition duration-300 disabled:opacity-50"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Share My Journey"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FoodJourneyForm;
