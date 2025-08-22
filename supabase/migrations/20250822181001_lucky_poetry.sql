/*
  # Add RPC functions for affiliate system

  1. Functions
    - increment_affiliate_clicks: Increment clicks for an affiliate code
    - get_affiliate_stats: Get complete affiliate statistics
*/

-- Function to increment affiliate clicks
CREATE OR REPLACE FUNCTION increment_affiliate_clicks(affiliate_code text)
RETURNS void AS $$
BEGIN
  UPDATE affiliates 
  SET clicks = clicks + 1 
  WHERE code = affiliate_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get affiliate stats with referrals
CREATE OR REPLACE FUNCTION get_affiliate_stats(user_id_param uuid)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  user_name text,
  code text,
  clicks integer,
  conversions integer,
  balance decimal,
  created_at timestamptz,
  referrals json
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.id,
    a.user_id,
    a.user_name,
    a.code,
    a.clicks,
    a.conversions,
    a.balance,
    a.created_at,
    COALESCE(
      json_agg(
        json_build_object(
          'id', r.id,
          'referred_name', r.referred_name,
          'plan', r.plan,
          'commission', r.commission,
          'created_at', r.created_at
        )
      ) FILTER (WHERE r.id IS NOT NULL),
      '[]'::json
    ) as referrals
  FROM affiliates a
  LEFT JOIN referrals r ON a.id = r.affiliate_id
  WHERE a.user_id = user_id_param
  GROUP BY a.id, a.user_id, a.user_name, a.code, a.clicks, a.conversions, a.balance, a.created_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;