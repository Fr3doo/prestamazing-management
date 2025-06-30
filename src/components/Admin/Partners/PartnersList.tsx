
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, ExternalLink, GripVertical } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Partner } from '@/hooks/usePartnersManagement';

interface PartnersListProps {
  partners: Partner[];
  onEdit: (partner: Partner) => void;
  onDelete: (id: string) => void;
  onDragEnd: (result: any) => void;
}

const PartnersList = ({ partners, onEdit, onDelete, onDragEnd }: PartnersListProps) => {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="partners">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="grid gap-4"
          >
            {partners.map((partner, index) => (
              <Draggable key={partner.id} draggableId={partner.id} index={index}>
                {(provided, snapshot) => (
                  <Card
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={`transition-shadow ${
                      snapshot.isDragging ? 'shadow-lg' : ''
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div
                          {...provided.dragHandleProps}
                          className="text-gray-400 hover:text-gray-600 cursor-grab"
                        >
                          <GripVertical className="h-5 w-5" />
                        </div>
                        
                        <div className="flex-shrink-0">
                          <img
                            src={partner.logo_url}
                            alt={partner.partner_name}
                            className="h-12 w-12 object-contain bg-gray-100 rounded border"
                          />
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {partner.partner_name}
                          </h3>
                          {partner.website_url && (
                            <a
                              href={partner.website_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                            >
                              <ExternalLink className="h-3 w-3" />
                              Visiter le site
                            </a>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(partner)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onDelete(partner.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default PartnersList;
