
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Star, Heart, MessageCircle } from 'lucide-react';
import Button from '../Button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [missingItem, setMissingItem] = useState('');
  const [missingItemNote, setMissingItemNote] = useState('');
  const [experience, setExperience] = useState('');
  const [experienceNote, setExperienceNote] = useState('');

  const handleMissingItemResponse = (response: string) => {
    setMissingItem(response);
    if (response === 'لا') {
      setStep(2);
    } else {
      // Show note box for missing item
      setStep(1.5);
    }
  };

  const handleExperienceResponse = (response: string) => {
    setExperience(response);
    if (response === 'جيد') {
      setStep(3);
    } else {
      // Show note box for experience
      setStep(2.5);
    }
  };

  const handleFinish = () => {
    // Here you could send the feedback to a backend or log it
    console.log('Feedback:', {
      missingItem,
      missingItemNote,
      experience,
      experienceNote
    });
    
    // Reset state
    setStep(1);
    setMissingItem('');
    setMissingItemNote('');
    setExperience('');
    setExperienceNote('');
    onClose();
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6 text-center">
            <div className="bg-blue-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
              <Heart className="w-8 h-8 text-blue-600" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-blue-800">ممكن ناخد من وقتك دقيقة؟</h3>
              <p className="text-gray-600">
                عايزين نعرف رأيك علشان نحسن الخدمة أكتر 😊
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-bold text-gray-800 mb-4">في حاجة مكنتش موجودة ونفسك تلاقيها؟</h4>
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={() => handleMissingItemResponse('أه')}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6"
                >
                  أه
                </Button>
                <Button
                  onClick={() => handleMissingItemResponse('لا')}
                  className="bg-green-500 hover:bg-green-600 text-white px-6"
                >
                  لا
                </Button>
              </div>
            </div>
          </div>
        );

      case 1.5:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-center">إيه اللي نفسك يكون موجود؟</h3>
            <div className="space-y-2">
              <Label htmlFor="missing-note">قولنا عايز إيه وهنحاول نوفره المرة الجاية</Label>
              <Textarea
                id="missing-note"
                placeholder="اكتب هنا..."
                value={missingItemNote}
                onChange={(e) => setMissingItemNote(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <Button
              onClick={() => setStep(2)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              متابعة
            </Button>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6 text-center">
            <div className="bg-yellow-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
              <Star className="w-8 h-8 text-yellow-600" />
            </div>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-bold text-gray-800 mb-4">إيه رأيك في التجربة معانا؟</h4>
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={() => handleExperienceResponse('جيد')}
                  className="bg-green-500 hover:bg-green-600 text-white px-6"
                >
                  جيد
                </Button>
                <Button
                  onClick={() => handleExperienceResponse('مش جيد')}
                  className="bg-red-500 hover:bg-red-600 text-white px-6"
                >
                  مش جيد
                </Button>
              </div>
            </div>
          </div>
        );

      case 2.5:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-center">قولنا إيه اللي محتاج تحسين؟</h3>
            <div className="space-y-2">
              <Label htmlFor="experience-note">كلامك مهم جداً بالنسبالنا</Label>
              <Textarea
                id="experience-note"
                placeholder="اكتب هنا..."
                value={experienceNote}
                onChange={(e) => setExperienceNote(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <Button
              onClick={() => setStep(3)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              متابعة
            </Button>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6 text-center">
            <div className="bg-green-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
              <Heart className="w-8 h-8 text-green-600" />
            </div>
            
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-green-800">شكراً على وقتك! 💚</h3>
              <p className="text-gray-600">
                إحنا بنسعى نطور الخدمة باستمرار علشان نكون في أحسن حال ليكم
              </p>
            </div>

            <Button
              onClick={handleFinish}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              تمام 👍
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-blue-600 flex items-center justify-center gap-2">
            <MessageCircle className="w-6 h-6" />
            رأيك يهمنا
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {renderStep()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackModal;
