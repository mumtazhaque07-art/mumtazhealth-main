import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log("Fetching premium content to re-distribute to standard tier...");
  
  const { data, error } = await supabase
    .from('wellness_content')
    .select('id, title, tier_requirement')
    .eq('tier_requirement', 'premium');

  if (error) {
    console.error("Error fetching data:", error);
    return;
  }

  if (!data || data.length === 0) {
    console.log("No premium content found.");
    return;
  }

  console.log(`Found ${data.length} premium items.`);
  
  // Update roughly half of them to 'standard'
  const itemsToUpdate = data.slice(0, Math.floor(data.length / 2));
  
  for (const item of itemsToUpdate) {
    const { error: updateError } = await supabase
      .from('wellness_content')
      .update({ tier_requirement: 'standard' })
      .eq('id', item.id);
      
    if (updateError) {
      console.error(`Error updating ${item.id}:`, updateError);
    } else {
      console.log(`Successfully updated "${item.title}" to standard tier.`);
    }
  }
  
  console.log("Done!");
}

main();
