/**
 * TrafficShield campaign identifiers, shared by the tag
 * (components/traffic-shield.tsx) and the verify handshake (proxy.ts).
 */
export const TRAFFIC_SHIELD_UID = "iBC8eGA82S";
export const TRAFFIC_SHIELD_CID = "tH5Bq3wpDP";
/**
 * Query parameter the vendor's integrations answer with the bare campaign id:
 * their PHP file returns it as text/plain, shield.js writes it over the body.
 * The dashboard's "Verify Installation" is the caller.
 */
export const TRAFFIC_SHIELD_VERIFY_PARAM = "4f5e78hgfhd";
