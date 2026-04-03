import { supabase } from './supabase';

export type ClickType = 'whatsapp_order' | 'whatsapp_share' | 'whatsapp_general' | 'facebook_share';

export async function logClick(type: ClickType, productId?: string) {
  try {
    const { error } = await supabase
      .from('click_analytics')
      .insert([
        { product_id: productId, type: type }
      ]);
    
    if (error) {
      console.warn('Logging click failed:', error.message);
    }
  } catch (err) {
    console.error('Error logging click:', err);
  }
}
