import BaseModel from './baseModel';

export class OptionProduct extends BaseModel {
  id: number;
  name: string;
  name_en: string;
  name_fr: string;
  available: boolean;
  price: string;
  details: string;
  details_fr: string;
  details_en: string;
  max_quantity: number;
  available_on_product_types: string;
  available_on_products: string;
  url: string;
}

