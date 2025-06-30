
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ComposableCardProps {
  title?: string;
  children: React.ReactNode;
  renderHeader?: () => React.ReactNode;
  renderFooter?: () => React.ReactNode;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    disabled?: boolean;
  }>;
  className?: string;
}

const ComposableCard = ({
  title,
  children,
  renderHeader,
  renderFooter,
  actions,
  className
}: ComposableCardProps) => {
  return (
    <Card className={className}>
      {(title || renderHeader) && (
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex-1">
            {title && <CardTitle>{title}</CardTitle>}
            {renderHeader?.()}
          </div>
          {actions && (
            <div className="flex gap-2">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant || 'default'}
                  onClick={action.onClick}
                  disabled={action.disabled}
                  size="sm"
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </CardHeader>
      )}
      
      <CardContent>
        {children}
      </CardContent>
      
      {renderFooter && (
        <div className="p-6 pt-0">
          {renderFooter()}
        </div>
      )}
    </Card>
  );
};

export default ComposableCard;
