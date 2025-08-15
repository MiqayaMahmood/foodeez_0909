import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '../core/Button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import ModalPortal from '../core/ModalPortal';

const DELIVERY_ACK_KEY = 'deliveryAcknowledged';

export const hasAcknowledgedDelivery = () => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(DELIVERY_ACK_KEY) === 'true';
};

interface DeliveryInfoModalProps {
  showDeliveryInfoModal: boolean;
  setShowDeliveryInfoModal: (show: boolean) => void;
  businessZipCode?: string;
  onProceed: (dontShowAgain: boolean) => void;
}

const DeliveryInfoModal = ({
  showDeliveryInfoModal,
  setShowDeliveryInfoModal,
  businessZipCode = 'your area',
  onProceed
}: DeliveryInfoModalProps) => {
  const router = useRouter();
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleProceed = () => {
    onProceed(dontShowAgain);
    setShowDeliveryInfoModal(false);
    if (dontShowAgain) {
      localStorage.setItem(DELIVERY_ACK_KEY, 'true');
    }
  };

  const handleCancel = () => {
    setShowDeliveryInfoModal(false);
    router.back();
  };

  if (!showDeliveryInfoModal) return null;

  return (
    <ModalPortal>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg w-full max-w-md p-6">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold mb-2">Delivery Information</h2>
            <p className="text-sm text-gray-600">
              This restaurant currently delivers only to {businessZipCode}.
            </p>
          </div>
          
          <div className="py-4 text-sm text-gray-600">
            <p className="mb-3">
             If your delivery address is outside of our current delivery zone.
            </p>
            <p className="mb-4">
              If you'd like to proceed, please confirm that you're within the delivery area or update your delivery address.
            </p>
            
            <div className="flex items-center space-x-2 mt-4">
              <Checkbox 
                id="dont-show-again" 
                checked={dontShowAgain}
                onCheckedChange={(checked) => setDontShowAgain(checked === true)}
              />
              <Label htmlFor="dont-show-again" className="text-sm font-medium leading-none">
                Don't show this message again
              </Label>
            </div>
          </div>

          <div className="flex flex-col w-full justify-end sm:flex-row gap-2 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="w-full sm:w-auto"
            >
              Go Back
            </Button>
            <Button
              type="button"
              onClick={handleProceed}
              className="w-full sm:w-auto bg-primary text-white hover:bg-primary/90"
            >
              Anyway Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </ModalPortal>
  )
}

export default DeliveryInfoModal