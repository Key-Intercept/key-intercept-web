import { createClient } from '@supabase/supabase-js';
import { verifySessionToken } from '../script/verifyDiscordToken';


export default async function ConfigSelect() {
    const configSelect = <select id="config-select"></select>
    const sessionToken = sessionStorage.getItem("ki-session");

    if (!sessionToken) {
        window.location.href = "/";
        return null;
    }

    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);


    try {
        const discordID = await verifySessionToken(`Bearer ${sessionToken}`);
    } catch (error) {
        console.error('[auth] Error verifying session token:', error);
        window.location.href = "/";
        return null;

    }

    const { data: profile, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('discord_id', discordID)
    .single();

    if (error) {
        console.error('[supabase] Error fetching user configs:', error);
        return configSelect; // Return the select element even if there's an error
    }

    const { data: domConfigs, error: configsError } = await supabase
    .from('Dom_Config_Access')
    .select('config_id')
    .eq('dom_id', profile.id);

    const { data: subConfig, error: subConfigError } = await supabase
    .from('Sub_Config_Access')
    .select('config_id')
    .in('sub_id', profile.id)
    .single();

    if (configsError || subConfigError) {
        console.error('[supabase] Error fetching user configs:', configsError || subConfigError);
        return configSelect; // Return the select element even if there's an error
    }
    
    const configs = [...domConfigs, ...(subConfig ? [subConfig] : [])];

    configs.forEach(async config => {
        const { data: subDetailsID, error: subDetailsIDError } = await supabase
        .from('Sub_Config_Access')
        .select('sub_id')
        .eq('config_id', config.id)
        .single();

        if (subDetailsIDError) {
            console.error('[supabase] Error fetching sub details ID:', subDetailsIDError);
            return;
        }

        const { data: subDetails, error: subDetailsError } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', subDetailsID.sub_id)
        .single();

        if (subDetailsError) {
            console.error('[supabase] Error fetching sub details:', subDetailsError);
            return;
        }

        const option = document.createElement('option');
        option.value = config.id;
        option.textContent = subDetails.display_name;
        configSelect.appendChild(option);
    });

    if (configs.length === 0) {
        const option = document.createElement('option');
        option.value = "";
        option.textContent = "--- No configs available ---";
        configSelect.appendChild(option);
    }


    return configSelect;
}