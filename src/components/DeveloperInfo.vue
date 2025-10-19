<template>
  <div class="developer-info">
    <div class="card">
      <h2>Meet the Development Team</h2>
      <p class="subtitle">The team behind IntelliGrade - dedicated to improving education through technology.</p>

      <div class="developers-grid">
        <div
          v-for="developer in developers"
          :key="developer.id"
          class="developer-card"
        >
          <div class="avatar">
            <img v-if="developer.photo" :src="developer.photo" :alt="developer.name" />
            <User v-else :size="48" />
          </div>
          <h3>{{ developer.name }}</h3>
          <p class="role">{{ developer.role }}</p>
          <p class="bio">{{ developer.bio }}</p>
          <div class="social-links">
            <a v-if="developer.email" :href="`mailto:${developer.email}`" class="social-btn" title="Email">
              <Mail :size="18" />
            </a>
            <a v-if="developer.github" :href="developer.github" target="_blank" class="social-btn" title="GitHub">
              <Github :size="18" />
            </a>
            <a v-if="developer.linkedin" :href="developer.linkedin" target="_blank" class="social-btn" title="LinkedIn">
              <Linkedin :size="18" />
            </a>
          </div>
        </div>
      </div>

      <!-- Contact Section -->
      <div class="contact-section">
        <h3>Get in Touch</h3>
        <p>Have questions or suggestions? Feel free to reach out to any of our team members or use the contact form above.</p>
        <div class="contact-methods">
          <div class="contact-item">
            <Mail :size="24" />
            <div>
              <strong>Email Support</strong>
              <p>support@intelligrade.com</p>
            </div>
          </div>
          <div class="contact-item">
            <Github :size="24" />
            <div>
              <strong>GitHub Repository</strong>
              <p>github.com/intelligrade/project</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { User, Mail, Github, Linkedin } from 'lucide-vue-next'

// Sample developer data - replace with actual data from your team
const developers = ref([
  {
    id: 1,
    name: 'Your Name',
    role: 'Full Stack Developer',
    bio: 'Passionate about creating educational technology solutions.',
    email: 'developer1@intelligrade.com',
    github: 'https://github.com/yourusername',
    linkedin: 'https://linkedin.com/in/yourusername',
    photo: null // Add photo URL if available
  },
  {
    id: 2,
    name: 'Team Member 2',
    role: 'Frontend Developer',
    bio: 'Specialized in creating intuitive user interfaces.',
    email: 'developer2@intelligrade.com',
    github: 'https://github.com/username2',
    linkedin: 'https://linkedin.com/in/username2',
    photo: null
  },
  {
    id: 3,
    name: 'Team Member 3',
    role: 'Backend Developer',
    bio: 'Expert in database design and API development.',
    email: 'developer3@intelligrade.com',
    github: 'https://github.com/username3',
    linkedin: 'https://linkedin.com/in/username3',
    photo: null
  },
  {
    id: 4,
    name: 'Team Member 4',
    role: 'UI/UX Designer',
    bio: 'Focused on creating user-centered design experiences.',
    email: 'developer4@intelligrade.com',
    linkedin: 'https://linkedin.com/in/username4',
    photo: null
  }
])
</script>

<style scoped>
.developer-info h2 {
  color: var(--primary);
  margin-bottom: 8px;
}

.subtitle {
  color: var(--text-light);
  margin-bottom: 32px;
}

.developers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.developer-card {
  border: 2px solid var(--border);
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  background: white;
  transition: all 0.3s ease;
}

.developer-card:hover {
  border-color: var(--primary);
  box-shadow: 0 4px 12px rgba(61, 141, 122, 0.1);
  transform: translateY(-4px);
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin: 0 auto 16px;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  overflow: hidden;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.developer-card h3 {
  color: var(--text-dark);
  margin-bottom: 4px;
  font-size: 20px;
}

.role {
  color: var(--primary);
  font-weight: 600;
  margin-bottom: 12px;
  font-size: 14px;
}

.bio {
  color: var(--text-light);
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 16px;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.social-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: var(--light);
  border: 2px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
  transition: all 0.3s ease;
  text-decoration: none;
}

.social-btn:hover {
  background-color: var(--primary);
  color: white;
  border-color: var(--primary);
  transform: translateY(-2px);
}

.contact-section {
  border-top: 2px solid var(--border);
  padding-top: 32px;
  margin-top: 32px;
}

.contact-section h3 {
  color: var(--primary);
  margin-bottom: 12px;
}

.contact-section > p {
  color: var(--text-light);
  margin-bottom: 24px;
}

.contact-methods {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.contact-item {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  padding: 16px;
  background-color: var(--light);
  border-radius: 8px;
}

.contact-item svg {
  color: var(--primary);
  flex-shrink: 0;
}

.contact-item strong {
  display: block;
  color: var(--text-dark);
  margin-bottom: 4px;
}

.contact-item p {
  color: var(--text-light);
  font-size: 14px;
  margin: 0;
}

@media (max-width: 768px) {
  .developers-grid {
    grid-template-columns: 1fr;
  }

  .contact-methods {
    grid-template-columns: 1fr;
  }
}
</style>