'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Category } from '@/types/category';
import { apiService } from '@/lib/api';
import { Loader2, Plus, Edit, Trash2, Clock, AlertCircle } from 'lucide-react';

interface CategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CategoriesModal({ isOpen, onClose }: CategoriesModalProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.getCategories();
      setCategories(data);
    } catch (err) {
      setError('Failed to fetch categories. Please try again.');
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatFieldType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const getPriorityName = (priorityId: number) => {
    const priorityMap: { [key: number]: string } = {
      1: 'Critical',
      2: 'High', 
      3: 'Medium',
      4: 'Low'
    };
    return priorityMap[priorityId] || `Priority ${priorityId}`;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Configure Categories" size="2xl">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-600">
              Manage ticket categories, their custom fields, and SLA configurations.
            </p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Category
          </Button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-500">Loading categories...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={fetchCategories} variant="outline">
                Try Again
              </Button>
            </div>
          </div>
        )}

        {/* Categories List */}
        {!loading && !error && (
          <div className="space-y-4">
            {categories.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Plus className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
                <p className="text-gray-500 mb-4">Get started by creating your first category.</p>
                <Button>Create Category</Button>
              </div>
            ) : (
              categories.map((category) => (
                <Card key={category.id} className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{category.name}</CardTitle>
                        <CardDescription className="mt-1">
                          {category.description || 'No description provided'}
                        </CardDescription>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span>Created by {category.created_by?.name || 'Unknown'}</span>
                          <span>•</span>
                          <span>{new Date(category.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    {/* Custom Fields */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                        Custom Fields ({category.fields.length})
                      </h4>
                      {category.fields.length === 0 ? (
                        <p className="text-gray-500 text-sm">No custom fields defined</p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {category.fields.map((field) => (
                            <div
                              key={field.id}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                              <div>
                                <span className="font-medium text-sm">{field.field_name}</span>
                                <span className="text-xs text-gray-500 ml-2">
                                  ({formatFieldType(field.field_type)})
                                </span>
                                {field.is_required && (
                                  <span className="text-xs text-red-500 ml-2">*Required</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* SLA Configurations */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        SLA Configurations ({category.priority_slas.length})
                      </h4>
                      {category.priority_slas.length === 0 ? (
                        <p className="text-gray-500 text-sm">No SLA configurations defined</p>
                      ) : (
                        <div className="space-y-2">
                          {category.priority_slas.map((sla) => (
                            <div
                              key={sla.id}
                              className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200"
                            >
                              <div className="flex items-center gap-4">
                                <span className="font-medium text-sm">
                                  {getPriorityName(sla.priority_id)}
                                </span>
                                <div className="flex items-center gap-4 text-xs text-gray-600">
                                  <span>
                                    First Response: <strong>{sla.sla_first_response_hours}h</strong>
                                  </span>
                                  <span>
                                    Resolution: <strong>{sla.sla_resolution_hours}h</strong>
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
