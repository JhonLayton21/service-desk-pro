export enum FieldType {
  TEXT = 'text',
  TEXTAREA = 'textarea',
  NUMBER = 'number',
  EMAIL = 'email',
  PHONE = 'phone',
  DATE = 'date',
  DATETIME = 'datetime',
  SELECT = 'select',
  CHECKBOX = 'checkbox',
  RADIO = 'radio',
}

export interface CategoryField {
  id: string;
  category_id: string;
  field_name: string;
  field_type: FieldType;
  is_required: boolean;
}

export interface CategoryPrioritySla {
  id: string;
  category_id: string;
  priority_id: number;
  sla_first_response_hours: number;
  sla_resolution_hours: number;
  priority?: {
    id: number;
    name: string;
  };
}

export interface Category {
  id: string;
  name: string;
  description: string;
  created_by_id: string;
  created_at: string;
  created_by?: {
    id: string;
    name: string;
    email: string;
  };
  fields: CategoryField[];
  priority_slas: CategoryPrioritySla[];
}
