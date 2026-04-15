-- Prodomatix Score Engine Trigger
-- This trigger automatically updates product scores when new ratings are inserted

-- Function to calculate and update product score
CREATE OR REPLACE FUNCTION update_prodo_score()
RETURNS TRIGGER AS $$
DECLARE
    new_avg_score DECIMAL(4,2);
    total_count INTEGER;
    old_price DECIMAL(4,2);
    price_diff DECIMAL(4,2);
    price_pct DECIMAL(5,2);
BEGIN
    -- Get current product price before update
    SELECT CAST(current_price AS DECIMAL) INTO old_price
    FROM products
    WHERE id = NEW.product_id;

    -- Calculate new weighted average across ALL ratings for this product
    SELECT 
        ROUND(AVG(CAST(weighted_score AS DECIMAL)), 2),
        COUNT(*)
    INTO new_avg_score, total_count
    FROM ratings
    WHERE product_id = NEW.product_id;

    -- Calculate price change
    price_diff := new_avg_score - COALESCE(old_price, 5.00);
    price_pct := CASE 
        WHEN COALESCE(old_price, 5.00) = 0 THEN 0
        ELSE ROUND((price_diff / COALESCE(old_price, 5.00)) * 100, 2)
    END;

    -- Update the product's score and related fields
    UPDATE products
    SET 
        previous_price = current_price,
        current_price = new_avg_score::TEXT,
        price_change = price_diff::TEXT,
        price_change_percent = price_pct::TEXT,
        total_ratings = total_count,
        updated_at = NOW(),
        -- Check dividend eligibility (score > 8.0)
        dividend_streak_days = CASE 
            WHEN new_avg_score >= 8.0 THEN COALESCE(dividend_streak_days, 0) + 1
            ELSE 0
        END,
        has_dividend_badge = CASE 
            WHEN new_avg_score >= 8.0 AND COALESCE(dividend_streak_days, 0) >= 29 THEN TRUE
            ELSE has_dividend_badge
        END
    WHERE id = NEW.product_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS after_rating_insert ON ratings;

-- Create trigger: Run the function every time a new rating is inserted
CREATE TRIGGER after_rating_insert
AFTER INSERT ON ratings
FOR EACH ROW
EXECUTE FUNCTION update_prodo_score();

-- Function to expire AdFlow campaigns
CREATE OR REPLACE FUNCTION expire_adflow_campaigns()
RETURNS void AS $$
BEGIN
    -- Deactivate expired campaigns
    UPDATE adflow_campaigns
    SET is_active = FALSE
    WHERE ends_at < NOW() AND is_active = TRUE;

    -- Remove promotion status from products with expired campaigns
    UPDATE products
    SET 
        is_adflow_promoted = FALSE,
        adflow_expires_at = NULL
    WHERE adflow_expires_at < NOW() AND is_adflow_promoted = TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function to record daily price history
CREATE OR REPLACE FUNCTION record_price_history()
RETURNS void AS $$
BEGIN
    INSERT INTO price_history (product_id, price, volume, recorded_at)
    SELECT 
        id,
        current_price,
        total_ratings,
        NOW()
    FROM products
    WHERE status = 'active';
END;
$$ LANGUAGE plpgsql;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_ratings_product_created ON ratings(product_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_score ON products(current_price DESC);
CREATE INDEX IF NOT EXISTS idx_products_promoted ON products(is_adflow_promoted) WHERE is_adflow_promoted = TRUE;
