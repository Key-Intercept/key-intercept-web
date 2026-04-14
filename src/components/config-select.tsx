import { createClient } from '@supabase/supabase-js';
import errorOccurred from './reactError';
import type { JSX } from 'react';

export default async function ConfigSelect({ discordID }: { discordID: string }) {
    const supabase = createClient(import.meta.env.SUPABASE_URL, import.meta.env.SUPABASE_SERVICE_KEY);

    const { data: profile, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('discord_id', discordID)
        .single();

    if (error) {
        console.error('[supabase] Error fetching user profile:', error);
        console.error('Discord ID:', discordID);
        return errorOccurred("--- Error loading configs ---");
    }

    const { data: domConfigs, error: configsError } = await supabase
        .from('Dom_Config_Access')
        .select('config_id')
        .eq('dom_id', profile.id);

    const { data: subConfigs, error: subConfigError } = await supabase
        .from('Sub_Config_Access')
        .select('config_id')
        .eq('sub_id', profile.id);

    if (configsError || subConfigError) {
        console.error('[supabase] Error fetching sub or dom config accesses:', configsError || subConfigError);
        console.error('Discord ID:', discordID);
        return errorOccurred("--- Error loading configs ---");
    }

    const configs = [
        ...(domConfigs ?? []),
        ...(subConfigs ?? []),
    ];

    const uniqueConfigs = [...new Map(configs.map((config) => [config.config_id, config])).values()];

    if (uniqueConfigs.length === 0) {
        return errorOccurred("--- No configs available ---");
    }

    const options = await Promise.all(
        uniqueConfigs.map(async (config) => {
            const { data: subDetailsID, error: subDetailsIDError } = await supabase
                .from('Sub_Config_Access')
                .select('sub_id')
                .eq('config_id', config.config_id)
                .single();

            if (subDetailsIDError || !subDetailsID) {
                console.error('[supabase] Error fetching sub details ID:', subDetailsIDError);
                console.error('Discord ID:', discordID);
                return null;
            }

            const { data: subDetails, error: subDetailsError } = await supabase
                .from('profiles')
                .select('display_name')
                .eq('id', subDetailsID.sub_id)
                .single();

            if (subDetailsError || !subDetails) {
                console.error('[supabase] Error fetching sub details:', subDetailsError);
                console.error('Discord ID:', discordID);
                return null;
            }

            return (
                <option key={config.config_id} value={config.config_id}>
                    {subDetails.display_name}
                </option>
            );
        })
    );

    const renderedOptions = [<option key="null" value="">--- Select a config ---</option>, ...options.filter((option): option is JSX.Element => option !== null)];

    if (renderedOptions.length === 0) {
        return errorOccurred("--- No configs available ---");
    }

    return <select id="config-select" style={{
        width: '100%', 
        fontSize: '1rem', 
        borderWidth: '2px', 
        borderColor: '#fff', 
        borderRadius: '30px', 
        marginBottom: '2rem', 
        fontFamily: '"Major Mono Display", monospace', 
        fontWeight: 400, 
        fontStyle: 'normal'
    }}>{renderedOptions}</select>;
}