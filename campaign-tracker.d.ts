import { Storage, Campaign, CampaignParser as ICampaignParser, CampaignTracker as ICampaignTracker, CampaignTrackFunction, CampaignTrackerOptions } from '@amplitude/analytics-types';
export declare class CampaignTracker implements ICampaignTracker {
    storage: Storage<Campaign>;
    storageKey: string;
    parser: ICampaignParser;
    track: CampaignTrackFunction;
    onNewCampaign: (campaign: Campaign) => unknown;
    disabled: boolean;
    trackNewCampaigns: boolean;
    trackPageViews: boolean;
    excludeReferrers: string[];
    initialEmptyValue: string;
    constructor(apiKey: string, options: CampaignTrackerOptions);
    isNewCampaign(current: Campaign, previous: Campaign | undefined, ignoreSubdomainInReferrer?: boolean): boolean;
    saveCampaignToStorage(campaign: Campaign): Promise<void>;
    getCampaignFromStorage(): Promise<Campaign | undefined>;
    createCampaignEvent(campaign: Campaign): {
        event_type: string;
        event_properties?: {
            [key: string]: any;
        } | undefined;
        user_properties: {
            [key: string]: any;
        };
        group_properties?: {
            [key: string]: any;
        } | undefined;
        groups?: {
            [key: string]: any;
        } | undefined;
        user_id?: string | undefined;
        device_id?: string | undefined;
        time?: number | undefined;
        location_lat?: number | undefined;
        location_lng?: number | undefined;
        app_version?: string | undefined;
        version_name?: string | undefined;
        library?: string | undefined;
        platform?: string | undefined;
        os_name?: string | undefined;
        os_version?: string | undefined;
        device_brand?: string | undefined;
        device_manufacturer?: string | undefined;
        device_model?: string | undefined;
        carrier?: string | undefined;
        country?: string | undefined;
        region?: string | undefined;
        city?: string | undefined;
        dma?: string | undefined;
        idfa?: string | undefined;
        idfv?: string | undefined;
        adid?: string | undefined;
        android_id?: string | undefined;
        language?: string | undefined;
        ip?: string | undefined;
        price?: number | undefined;
        quantity?: number | undefined;
        revenue?: number | undefined;
        productId?: string | undefined;
        revenueType?: string | undefined;
        event_id?: number | undefined;
        session_id?: number | undefined;
        insert_id?: string | undefined;
        plan?: import("@amplitude/analytics-types").Plan | undefined;
        ingestion_metadata?: import("@amplitude/analytics-types/lib/esm/ingestion-metadata").IngestionMetadataEventProperty | undefined;
        partner_id?: string | undefined;
        extra?: {
            [key: string]: any;
        } | undefined;
    };
    send(isNewSession: boolean): Promise<void>;
}
//# sourceMappingURL=campaign-tracker.d.ts.map