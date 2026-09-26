"""
Generate AI Crop Guardian PowerPoint presentation.
Run: python documentation/generate_ppt.py
Output: documentation/AI_Crop_Guardian_Presentation.pptx
"""
from pathlib import Path

try:
    from pptx import Presentation
    from pptx.util import Inches, Pt
    from pptx.dml.color import RGBColor
    from pptx.enum.text import PP_ALIGN
except ImportError:
    print("Install: pip install python-pptx")
    raise

OUTPUT = Path(__file__).parent / "AI_Crop_Guardian_Presentation.pptx"

# Brand colors
GREEN = RGBColor(0x16, 0xA3, 0x4A)
DARK = RGBColor(0x0F, 0x17, 0x2A)
WHITE = RGBColor(0xFF, 0xFF, 0xFF)
GRAY = RGBColor(0x64, 0x74, 0x8B)


def set_title_style(shape, size=36):
    if not shape.has_text_frame:
        return
    for p in shape.text_frame.paragraphs:
        p.font.size = Pt(size)
        p.font.bold = True
        p.font.color.rgb = DARK


def add_bullets(tf, items, size=18):
    tf.clear()
    for i, item in enumerate(items):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.text = item
        p.level = 0
        p.font.size = Pt(size)
        p.font.color.rgb = GRAY


def add_slide_title_only(prs, title, subtitle=""):
    slide = prs.slides.add_slide(prs.slide_layouts[6])  # blank
    # Title bar background
    title_box = slide.shapes.add_textbox(Inches(0.5), Inches(2.2), Inches(9), Inches(1.2))
    tf = title_box.text_frame
    tf.text = title
    set_title_style(title_box, 40)
    if subtitle:
        sub = slide.shapes.add_textbox(Inches(0.5), Inches(3.4), Inches(9), Inches(0.8))
        sub.text_frame.text = subtitle
        for p in sub.text_frame.paragraphs:
            p.font.size = Pt(20)
            p.font.color.rgb = GRAY
    # Accent line
    line = slide.shapes.add_shape(1, Inches(0.5), Inches(2), Inches(2), Inches(0.08))
    line.fill.solid()
    line.fill.fore_color.rgb = GREEN
    line.line.fill.background()


def add_slide_content(prs, title, bullets):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    tbox = slide.shapes.add_textbox(Inches(0.5), Inches(0.4), Inches(9), Inches(0.9))
    tbox.text_frame.text = title
    set_title_style(tbox, 32)
    body = slide.shapes.add_textbox(Inches(0.6), Inches(1.4), Inches(8.8), Inches(5.5))
    add_bullets(body.text_frame, bullets)


def add_slide_two_col(prs, title, left_title, left_items, right_title, right_items):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    tbox = slide.shapes.add_textbox(Inches(0.5), Inches(0.35), Inches(9), Inches(0.8))
    tbox.text_frame.text = title
    set_title_style(tbox, 30)
    for x, st, items in [(0.5, left_title, left_items), (5.2, right_title, right_items)]:
        ht = slide.shapes.add_textbox(Inches(x), Inches(1.2), Inches(4.3), Inches(0.5))
        ht.text_frame.text = st
        for p in ht.text_frame.paragraphs:
            p.font.bold = True
            p.font.size = Pt(16)
            p.font.color.rgb = GREEN
        bx = slide.shapes.add_textbox(Inches(x), Inches(1.7), Inches(4.3), Inches(4.5))
        add_bullets(bx.text_frame, left_items if st == left_title else right_items, 14)


def build():
    prs = Presentation()
    prs.slide_width = Inches(10)
    prs.slide_height = Inches(7.5)

    add_slide_title_only(
        prs,
        "AI Crop Guardian",
        "Precision Farming Intelligence Platform\nFull-Stack AI Agriculture SaaS",
    )

    add_slide_content(
        prs,
        "Problem Statement",
        [
            "Crop diseases spread before farmers notice visible symptoms",
            "Irrigation is often guesswork — water waste or crop stress",
            "Late pest detection causes major yield and revenue loss",
            "Weather changes increase fungal and heat-related risks",
            "Expert advice is costly and rarely available in local languages",
            "Farm records are scattered — no single source of truth",
        ],
    )

    add_slide_content(
        prs,
        "Our Solution — AI Crop Guardian",
        [
            "AI leaf disease scan with treatment & prevention plans",
            "Smart irrigation ML from moisture, weather, and crop type",
            "Pest image detection with confidence & bounding boxes",
            "Weather forecasts + disease-risk weather alerts",
            "Multilingual AI assistant (English, Hindi, Gujarati) + voice",
            "Unified dashboard, crop tracking, PDF farm reports",
            "Admin panel for users and platform analytics",
        ],
    )

    add_slide_two_col(
        prs,
        "System Architecture",
        "Frontend (React)",
        ["Port 5173 — Vite + Tailwind", "Dashboard, charts, chatbot", "JWT auth, dark/light mode"],
        "Backend + AI",
        [
            "Express API :5000 + MongoDB",
            "FastAPI ML service :8000",
            "Disease CNN, Pest YOLO, Irrigation ML",
            "Socket.io for real-time alerts",
        ],
    )

    add_slide_content(
        prs,
        "Technology Stack",
        [
            "Frontend: React, Vite, TailwindCSS, Framer Motion, Zustand, Recharts",
            "Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcrypt, Multer",
            "Real-time: Socket.io notifications",
            "AI: Python FastAPI, TensorFlow, OpenCV, Ultralytics, scikit-learn",
            "DevOps: Docker Compose, Nginx, Winston logging",
            "Optional: OpenWeather, OpenAI / Gemini APIs",
        ],
    )

    features = [
        ("AI Disease Detection", "Upload leaf image → CNN analysis → disease, confidence, severity, treatment, heatmap, history"),
        ("Pest Detection", "YOLO-style detection → pest class, bounding boxes, risk level"),
        ("Smart Irrigation", "Soil moisture + weather → water liters, schedule, risk"),
        ("Weather Intelligence", "Current + forecast charts, storm alerts, disease-weather risks"),
        ("AI Farming Assistant", "Chatbot with EN/HI/GU + voice input; OpenAI/Gemini/local fallback"),
        ("Farm Dashboard", "Health score, trends, disease reports, notifications, quick actions"),
    ]
    for title, desc in features:
        add_slide_content(prs, title, [desc])

    add_slide_content(
        prs,
        "Crop Management & Reports",
        [
            "My Crops — add crops, track health score and status",
            "PDF Farm Report — downloadable summary of crops, diseases, AI predictions",
            "Profile — update farm name, language, password",
        ],
    )

    add_slide_content(
        prs,
        "Admin Panel",
        [
            "Platform statistics: users, farmers, disease reports, AI calls",
            "AI usage breakdown by type (chart)",
            "Recent users and disease reports across platform",
            "User management: roles, activate/deactivate",
            "Demo: admin@aicropguardian.com / admin123",
        ],
    )

    add_slide_content(
        prs,
        "Database (MongoDB)",
        [
            "users — authentication, roles, farm profile, location",
            "crops — crop details and health scores",
            "diseasereports — AI disease scan history",
            "predictions — irrigation and pest AI results",
            "chatbothistories, notifications, weatherlogs",
        ],
    )

    add_slide_content(
        prs,
        "Security & UI/UX",
        [
            "bcrypt password hashing, JWT tokens, protected API routes",
            "Rate limiting, Helmet.js, centralized error handling",
            "Glassmorphism UI, gradients, smooth Framer Motion animations",
            "Responsive mobile design, skeleton loaders, toast alerts",
            "PWA — installable progressive web app",
            "Premium landing page with features, stats, testimonials",
        ],
    )

    add_slide_content(
        prs,
        "How to Run (Demo)",
        [
            "1. MongoDB running locally or Atlas URI in server/.env",
            "2. cd server && npm run seed  (demo users)",
            "3. cd ai-service && uvicorn main:app --port 8000",
            "4. cd server && npm run dev",
            "5. cd client && npm run dev",
            "6. Open http://localhost:5173",
            "Farmer: farmer@demo.com / farmer123",
        ],
    )

    add_slide_content(
        prs,
        "Future Scope",
        [
            "Production-trained PlantVillage CNN and YOLOv8 weights",
            "SMS / WhatsApp critical disease alerts",
            "React Native mobile app",
            "Cooperative / government multi-farm dashboards",
            "Satellite NDVI integration",
            "SaaS subscriptions and payments",
        ],
    )

    add_slide_title_only(
        prs,
        "Thank You",
        "AI Crop Guardian — Grow Smarter with AI\nQuestions?",
    )

    prs.save(OUTPUT)
    print(f"Created: {OUTPUT}")
    print(f"Slides: {len(prs.slides)}")


if __name__ == "__main__":
    build()
