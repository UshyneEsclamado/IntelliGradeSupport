<template>
  <div class="developer-info-wrapper">
    <div class="info-header">
      <div class="header-content">
        <Users :size="32" class="header-icon" />
        <div>
          <h2>Meet the Development Team</h2>
          <p class="header-subtitle">The talented team behind IntelliGrade - dedicated to improving education through technology.</p>
        </div>
      </div>
    </div>

    <div class="info-container">
      <!-- Developers Grid -->
      <div class="developers-section">
        <h3 class="section-title">Our Team</h3>
        <div class="developers-grid">
          <div
            v-for="developer in developers"
            :key="developer.id"
            class="developer-card"
          >
            <div class="card-header">
              <div class="avatar">
                <img v-if="developer.photo" :src="developer.photo" :alt="developer.name" />
                <User v-else :size="48" class="avatar-icon" />
              </div>
              <div class="role-badge">{{ developer.role }}</div>
            </div>

            <div class="card-content">
              <h3 class="developer-name">{{ developer.name }}</h3>
              <p class="developer-bio">{{ developer.bio }}</p>
            </div>

            <div class="card-footer">
              <div class="social-links">
                <a 
                  v-if="developer.email" 
                  :href="`mailto:${developer.email}`" 
                  class="social-btn mail-btn" 
                  title="Send email"
                  aria-label="Email"
                >
                  <Mail :size="18" />
                </a>
                <a 
                  v-if="developer.github" 
                  :href="developer.github" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="social-btn github-btn" 
                  title="View GitHub"
                  aria-label="GitHub"
                >
                  <Github :size="18" />
                </a>
                <a 
                  v-if="developer.linkedin" 
                  :href="developer.linkedin" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="social-btn linkedin-btn" 
                  title="View LinkedIn"
                  aria-label="LinkedIn"
                >
                  <Linkedin :size="18" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Contact Section -->
      <div class="contact-section">
        <h3 class="section-title">Get in Touch</h3>
        <p class="section-subtitle">Have questions, suggestions, or feedback? We'd love to hear from you!</p>
        
        <div class="contact-methods">
          <div class="contact-card">
            <div class="contact-icon mail-icon">
              <Mail :size="28" />
            </div>
            <div class="contact-info">
              <h4>Email Support</h4>
              <p>support@intelligrade.com</p>
              <a href="mailto:support@intelligrade.com" class="contact-link">Send an email →</a>
            </div>
          </div>

          <div class="contact-card">
            <div class="contact-icon github-icon">
              <Github :size="28" />
            </div>
            <div class="contact-info">
              <h4>GitHub Repository</h4>
              <p>github.com/intelligrade</p>
              <a href="https://github.com/UshyneEsclamado" target="_blank" rel="noopener noreferrer" class="contact-link">
                View repository →
              </a>
            </div>
          </div>

          <div class="contact-card">
            <div class="contact-icon feedback-icon">
              <MessageSquare :size="28" />
            </div>
            <div class="contact-info">
              <h4>Share Feedback</h4>
              <p>Tell us what you think</p>
              <button @click="navigateToFeedback" class="contact-link">Go to feedback →</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Tech Stack Section -->
      <div class="tech-section">
        <h3 class="section-title">Built With</h3>
        <div class="tech-grid">
          <div v-for="tech in technologies" :key="tech" class="tech-badge">
            {{ tech }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { User, Mail, Github, Linkedin, Users, MessageSquare } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const router = useRouter()
const developers = ref([
  {
    id: 1,
    name: 'Ushyne Esclamado',
    role: 'Lead Developer',
    bio: 'Full Stack Developer passionate about creating innovative educational technology solutions.',
    email: 'ushyne@intelligrade.com',
    github: 'https://github.com/UshyneEsclamado',
    linkedin: 'https://linkedin.com/in/ushyneesclamado',
    photo: null
  },
  {
    id: 2,
    name: 'Jusalyn Gimao',
    role: 'Frontend Developer',
    bio: 'Specialized in creating intuitive user interfaces and exceptional user experiences.',
    email: 'jusalyn@intelligrade.com',
    github: 'https://github.com/jusalyngimao',
    linkedin: 'https://linkedin.com/in/jusalyngimao',
    photo: null
  }
])

const technologies = [
  'Vue 3',
  'Supabase',
  'PostgreSQL',
  'Tailwind CSS',
  'Node.js',
  'Python',
  'Docker',
  'GitHub Actions'
]

const navigateToFeedback = () => {
  // Navigate to the feedback tab using parent's method or emit event
  // You can customize this based on your routing setup
  const parentRoute = router.currentRoute.value.matched[0]?.path
  if (parentRoute && parentRoute.includes('support')) {
    // Emit event to parent to switch to feedback tab
    window.dispatchEvent(new CustomEvent('navigate-to-tab', { detail: 'feedback' }))
  }
}

onMounted(() => {
  // Team members are now hardcoded with real data
})
</script>

<style scoped>
* {
  --primary-bg: #3D8D7A;
  --primary-btn: #B3D8A8;
  --primary-text: #FBFFE4;
  --accent: #A3D1C6;
  --dark-text: #1a1a1a;
  --light-bg: #f8f9f7;
  --border-color: #e0e0e0;
}

.developer-info-wrapper {
  max-width: 1000px;
  margin: 0 auto;
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Header Section */
.info-header {
  background: linear-gradient(135deg, var(--primary-bg) 0%, var(--accent) 100%);
  border-radius: 20px 20px 0 0;
  padding: 40px;
  color: var(--primary-text);
  box-shadow: 0 10px 30px rgba(61, 141, 122, 0.2);
}

.header-content {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.header-icon {
  flex-shrink: 0;
  color: var(--primary-text);
  opacity: 0.9;
}

.info-header h2 {
  font-size: 32px;
  font-weight: 800;
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
}

.header-subtitle {
  font-size: 15px;
  margin: 0;
  opacity: 0.95;
  line-height: 1.6;
  font-weight: 300;
}

/* Info Container */
.info-container {
  background: white;
  border-radius: 0 0 20px 20px;
  padding: 40px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--border-color);
  border-top: none;
}

/* Section Title */
.section-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--dark-text);
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
}

.section-subtitle {
  color: #666;
  font-size: 15px;
  margin: 0 0 28px 0;
  line-height: 1.6;
}

/* Developers Section */
.developers-section {
  margin-bottom: 48px;
}

.developers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.developer-card {
  background: white;
  border: 2px solid var(--border-color);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  display: flex;
  flex-direction: column;
  height: 100%;
}

.developer-card:hover {
  border-color: var(--primary-bg);
  box-shadow: 0 12px 40px rgba(61, 141, 122, 0.15);
  transform: translateY(-8px);
}

.card-header {
  background: linear-gradient(135deg, var(--light-bg) 0%, rgba(179, 216, 168, 0.1) 100%);
  padding: 24px 24px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
  position: relative;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-bg) 0%, var(--accent) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-text);
  overflow: hidden;
  border: 3px solid white;
  box-shadow: 0 4px 12px rgba(61, 141, 122, 0.2);
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-icon {
  color: var(--primary-text);
}

.role-badge {
  display: inline-block;
  background: var(--primary-bg);
  color: var(--primary-text);
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.card-content {
  flex: 1;
  padding: 20px 24px;
}

.developer-name {
  font-size: 18px;
  font-weight: 700;
  color: var(--dark-text);
  margin: 0 0 8px 0;
  letter-spacing: -0.3px;
}

.developer-bio {
  font-size: 13px;
  color: #666;
  line-height: 1.6;
  margin: 0;
}

.card-footer {
  border-top: 1px solid var(--border-color);
  padding: 16px 24px;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

.social-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--light-bg);
  border: 2px solid transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-bg);
  transition: all 0.3s ease;
  text-decoration: none;
  cursor: pointer;
}

.social-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(61, 141, 122, 0.2);
}

.social-btn.mail-btn:hover {
  background: #EA4335;
  color: white;
  border-color: #EA4335;
}

.social-btn.github-btn:hover {
  background: #333;
  color: white;
  border-color: #333;
}

.social-btn.linkedin-btn:hover {
  background: #0A66C2;
  color: white;
  border-color: #0A66C2;
}

/* Contact Section */
.contact-section {
  background: linear-gradient(135deg, rgba(61, 141, 122, 0.05) 0%, rgba(163, 209, 198, 0.05) 100%);
  border: 2px solid var(--border-color);
  border-radius: 16px;
  padding: 40px;
  margin-bottom: 40px;
}

.contact-methods {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
}

.contact-card {
  background: white;
  border: 2px solid var(--border-color);
  border-radius: 14px;
  padding: 24px;
  display: flex;
  gap: 16px;
  transition: all 0.3s ease;
}

.contact-card:hover {
  border-color: var(--primary-bg);
  box-shadow: 0 8px 24px rgba(61, 141, 122, 0.1);
  transform: translateY(-4px);
}

.contact-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.contact-icon.mail-icon {
  background: rgba(234, 67, 53, 0.1);
  color: #EA4335;
}

.contact-icon.github-icon {
  background: rgba(0, 0, 0, 0.08);
  color: #333;
}

.contact-icon.feedback-icon {
  background: rgba(61, 141, 122, 0.1);
  color: var(--primary-bg);
}

.contact-info h4 {
  margin: 0 0 4px 0;
  font-size: 15px;
  font-weight: 700;
  color: var(--dark-text);
}

.contact-info p {
  margin: 0 0 8px 0;
  font-size: 13px;
  color: #666;
}

.contact-link {
  display: inline-block;
  color: var(--primary-bg);
  text-decoration: none;
  font-size: 13px;
  font-weight: 700;
  transition: all 0.2s ease;
  border: none;
  background: none;
  cursor: pointer;
  padding: 0;
  font-family: inherit;
}

.contact-link:hover {
  transform: translateX(4px);
}

/* Tech Stack Section */
.tech-section {
  background: linear-gradient(135deg, rgba(163, 209, 198, 0.05) 0%, rgba(61, 141, 122, 0.05) 100%);
  border: 2px solid var(--border-color);
  border-radius: 16px;
  padding: 40px;
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
}

.tech-badge {
  background: white;
  border: 2px solid var(--primary-bg);
  color: var(--primary-bg);
  padding: 12px 16px;
  border-radius: 10px;
  text-align: center;
  font-weight: 700;
  font-size: 13px;
  transition: all 0.3s ease;
}

.tech-badge:hover {
  background: var(--primary-bg);
  color: var(--primary-text);
  transform: scale(1.05);
}

/* Responsive */
@media (max-width: 768px) {
  .info-header {
    padding: 32px 24px;
  }

  .header-content {
    gap: 16px;
  }

  .info-header h2 {
    font-size: 26px;
  }

  .header-subtitle {
    font-size: 14px;
  }

  .info-container {
    padding: 24px;
    border-radius: 0 0 16px 16px;
  }

  .developers-grid {
    grid-template-columns: 1fr;
  }

  .contact-methods {
    grid-template-columns: 1fr;
  }

  .contact-section {
    padding: 24px;
  }

  .tech-section {
    padding: 24px;
  }

  .tech-grid {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  }
}

@media (max-width: 480px) {
  .info-header {
    padding: 24px 16px;
    border-radius: 16px 16px 0 0;
  }

  .header-content {
    flex-direction: column;
    gap: 12px;
  }

  .info-header h2 {
    font-size: 22px;
  }

  .info-header svg {
    width: 28px;
    height: 28px;
  }

  .info-container {
    padding: 16px;
    border-radius: 0 0 16px 16px;
  }

  .section-title {
    font-size: 20px;
  }

  .developers-grid {
    grid-template-columns: 1fr;
  }

  .avatar {
    width: 80px;
    height: 80px;
  }

  .developer-name {
    font-size: 16px;
  }

  .contact-card {
    flex-direction: column;
    text-align: center;
  }

  .contact-icon {
    margin: 0 auto;
  }

  .contact-link {
    display: block;
    margin-top: 4px;
  }

  .tech-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>