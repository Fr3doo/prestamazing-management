
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Upload, X } from 'lucide-react';

interface PartnerLogoUploadProps {
  logoPreview: string;
  logoFile: File | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearLogo: () => void;
}

const PartnerLogoUpload = ({ 
  logoPreview, 
  logoFile, 
  onFileChange, 
  onClearLogo 
}: PartnerLogoUploadProps) => {
  return (
    <div>
      <Label>Logo du partenaire *</Label>
      
      {logoPreview ? (
        <Card className="mt-2">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <img
                src={logoPreview}
                alt="Aperçu du logo"
                className="h-16 w-16 object-contain bg-gray-100 rounded border"
              />
              <div className="flex-1">
                <p className="text-sm text-gray-600">
                  {logoFile ? logoFile.name : 'Logo actuel'}
                </p>
                {logoFile && (
                  <p className="text-xs text-gray-500">
                    {(logoFile.size / 1024).toFixed(1)} KB
                  </p>
                )}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClearLogo}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="mt-2">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-4 text-gray-500" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Cliquez pour télécharger</span> ou glissez-déposez
              </p>
              <p className="text-xs text-gray-500">PNG, JPG, GIF (MAX. 2MB)</p>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={onFileChange}
            />
          </label>
        </div>
      )}
    </div>
  );
};

export default PartnerLogoUpload;
