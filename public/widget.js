(function () {

  const API_URL = "http://localhost:3000/api/reviews"; // Should be dynamic in production

  function init() {
    const container = document.getElementById("prodomatix-reviews");
    if (!container) {
      console.warn("Prodomatix: Container #prodomatix-reviews not found.");
      return;
    }

    const productId = container.getAttribute("data-product-id");
    if (!productId) {
      console.error("Prodomatix: data-product-id attribute is missing.");
      return;
    }

    // 1. Render the Widget UI
    renderWidget(container, productId);

    // 2. SEO Injection: Fetch Aggregates & Inject JSON-LD
    fetch(`${API_URL}?productId=${productId}`)
      .then((res) => {
        if (!res.ok) throw new Error(`API Error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data.aggregates && data.product) {
          injectJsonLd(data.product, data.aggregates);
        }
      })
      .catch((err) => console.error("Prodomatix SEO Injection Failed:", err));
  }

  function injectJsonLd(product, aggregates) {
    if (aggregates.reviewCount === 0) return;

    const schema = {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": product.name,
      "sku": product.sku,
      "image": product.imageUrl,
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": aggregates.ratingValue,
        "reviewCount": aggregates.reviewCount,
        "bestRating": "5",
        "worstRating": "1"
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);
  }

  function renderWidget(container, productId) {
    container.innerHTML = `
      <style>
        .pdm-widget {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          max-width: 600px;
          margin: 20px auto;
          padding: 24px;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(0, 0, 0, 0.1);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        .pdm-title { font-size: 20px; font-weight: 600; margin-bottom: 16px; color: #111; }
        .pdm-stars { display: flex; gap: 4px; margin-bottom: 16px; }
        .pdm-star { cursor: pointer; font-size: 24px; color: #ccc; transition: color 0.2s; }
        .pdm-star.active { color: #f59e0b; }
        .pdm-form-group { margin-bottom: 16px; }
        .pdm-label { display: block; font-size: 14px; font-weight: 500; margin-bottom: 4px; color: #444; }
        .pdm-input, .pdm-textarea {
          width: 100%;
          padding: 8px 12px;
          border-radius: 8px;
          border: 1px solid #ddd;
          font-size: 14px;
          box-sizing: border-box;
        }
        .pdm-textarea { height: 100px; resize: vertical; }
        .pdm-button {
          background: #000;
          color: #fff;
          border: none;
          padding: 10px 20px;
          border-radius: 9999px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        .pdm-button:hover { background: #333; }
        .pdm-button:disabled { background: #ccc; cursor: not-allowed; }
        .pdm-message { margin-top: 12px; font-size: 14px; }
        .pdm-message.success { color: #10b981; }
        .pdm-message.error { color: #ef4444; }
      </style>
      <div class="pdm-widget">
        <h3 class="pdm-title">Customer Feedback</h3>
        <div class="pdm-stars" id="pdm-star-container">
          ${[1, 2, 3, 4, 5]
            .map((i) => `<span class="pdm-star" data-rating="${i}">★</span>`)
            .join("")}
        </div>
        <form id="pdm-review-form">
          <div class="pdm-form-group">
            <label class="pdm-label">Name</label>
            <input type="text" name="name" class="pdm-input" placeholder="Your name" required />
          </div>
          <div class="pdm-form-group">
            <label class="pdm-label">Title</label>
            <input type="text" name="title" class="pdm-input" placeholder="Review headline" required />
          </div>
          <div class="pdm-form-group">
            <label class="pdm-label">Review</label>
            <textarea name="content" class="pdm-textarea" placeholder="Tell us about the product..." required></textarea>
          </div>
          <button type="submit" class="pdm-button" id="pdm-submit">Submit Review</button>
          <div id="pdm-status" class="pdm-message"></div>
        </form>
      </div>
    `;

    setupForm(container, productId);
  }

  function setupForm(container, productId) {
    let currentRating = 0;
    const stars = container.querySelectorAll(".pdm-star");
    const starContainer = container.querySelector("#pdm-star-container");
    const form = container.querySelector("#pdm-review-form");
    const submitBtn = container.querySelector("#pdm-submit");
    const statusMsg = container.querySelector("#pdm-status");

    stars.forEach((star) => {
      star.addEventListener("click", () => {
        currentRating = parseInt(star.getAttribute("data-rating"));
        updateStars(stars, currentRating);
      });
      star.addEventListener("mouseenter", () => {
        updateStars(stars, parseInt(star.getAttribute("data-rating")));
      });
    });

    starContainer.addEventListener("mouseleave", () => {
      updateStars(stars, currentRating);
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (currentRating === 0) {
        statusMsg.innerText = "Please select a rating.";
        statusMsg.className = "pdm-message error";
        return;
      }

      const formData = new FormData(form);
      const data = {
        productId,
        rating: currentRating,
        reviewerName: formData.get("name"),
        title: formData.get("title"),
        content: formData.get("content"),
      };

      submitBtn.disabled = true;
      statusMsg.innerText = "Submitting...";
      statusMsg.className = "pdm-message";

      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          statusMsg.innerText = "Thank you! Your review has been submitted for moderation.";
          statusMsg.className = "pdm-message success";
          form.reset();
          currentRating = 0;
          updateStars(stars, 0);
        } else {
          // Robustly handle non-JSON error responses
          let errorMsg = "Failed to submit review.";
          try {
             const errorData = await response.json();
             errorMsg = errorData.error || errorMsg;
          } catch {
             errorMsg = `Server Error (${response.status})`;
          }
          statusMsg.innerText = `Error: ${errorMsg}`;
          statusMsg.className = "pdm-message error";
        }
      } catch (err) {
        console.error("Widget submission error:", err);
        statusMsg.innerText = "Error: Network error. Please try again later.";
        statusMsg.className = "pdm-message error";
      } finally {
        submitBtn.disabled = false;
      }
    });
  }

  function updateStars(stars, rating) {
    stars.forEach((star) => {
      const starRating = parseInt(star.getAttribute("data-rating"));
      if (starRating <= rating) {
        star.classList.add("active");
      } else {
        star.classList.remove("active");
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
