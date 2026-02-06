'use client'

import { useState, useEffect } from 'react'
import { callAIAgent } from '@/lib/aiAgent'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  FaHeart,
  FaRegHeart,
  FaDog,
  FaCat,
  FaHome,
  FaSearch,
  FaComments,
  FaUser,
  FaPaw,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaMapMarkerAlt,
  FaRuler,
  FaBirthdayCake,
  FaVenusMars,
  FaCheckCircle,
  FaClock,
  FaEye,
  FaPaperPlane,
  FaFilter,
  FaStar,
  FaBuilding,
  FaPhone,
  FaEnvelope,
  FaGlobe
} from 'react-icons/fa'

// TypeScript Interfaces based on test responses
interface RecommendedAnimal {
  animal_name: string
  species: string
  breed: string
  age: string
  compatibility_percentage: number
  match_reasons: string[]
  care_considerations: string[]
}

interface PetMatchingResponse {
  status: 'success' | 'error'
  result: {
    recommended_animals: RecommendedAnimal[]
    total_matches: number
  }
}

interface AdoptionGuideResponse {
  status: 'success' | 'error'
  result: {
    guidance_message: string
    actionable_tips: string[]
    relevant_resources: string[]
  }
}

interface Animal {
  id: string
  name: string
  species: 'Dog' | 'Cat' | 'Rabbit'
  breed: string
  age: string
  ageCategory: 'Puppy/Kitten' | 'Young' | 'Adult' | 'Senior'
  size: 'Small' | 'Medium' | 'Large'
  gender: 'Male' | 'Female'
  location: string
  shelter: string
  shelterId: string
  shelterVerified: boolean
  images: string[]
  description: string
  healthStatus: string
  behaviorNotes: string
  specialNeeds: boolean
  featured: boolean
}

interface Shelter {
  id: string
  name: string
  location: string
  city: string
  state: string
  distance: number // in kilometers
  verified: boolean
  phone: string
  email: string
  website: string
  description: string
  animalsAvailable: number
  image: string
  operatingHours: string
  specialties: string[]
}

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  tips?: string[]
  resources?: string[]
  timestamp: Date
}

interface Application {
  id: string
  animalId: string
  animalName: string
  animalImage: string
  status: 'pending' | 'reviewing' | 'approved' | 'rejected'
  submittedDate: string
}

// Mock animal data - Indian breeds and cities
const mockAnimals: Animal[] = [
  {
    id: '1',
    name: 'Raja',
    species: 'Dog',
    breed: 'Indian Pariah Dog',
    age: '2 years',
    ageCategory: 'Young',
    size: 'Medium',
    gender: 'Male',
    location: 'Mumbai, Maharashtra',
    shelter: 'Mumbai Animal Welfare',
    shelterId: 's1',
    shelterVerified: true,
    images: ['https://images.unsplash.com/photo-1568572933382-74d440642117?w=800', 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=800'],
    description: 'Raja is a friendly and intelligent Indian Pariah Dog, known for their adaptability and loyalty. He is great with families and adapts well to Indian climate.',
    healthStatus: 'Fully vaccinated, neutered, dewormed',
    behaviorNotes: 'Alert, independent, loyal, excellent guard dog, heat-tolerant',
    specialNeeds: false,
    featured: true
  },
  {
    id: '2',
    name: 'Mira',
    species: 'Cat',
    breed: 'Indian Billi',
    age: '1 year',
    ageCategory: 'Young',
    size: 'Small',
    gender: 'Female',
    location: 'Delhi, NCR',
    shelter: 'Delhi Cat Rescue',
    shelterId: 's2',
    shelterVerified: true,
    images: ['https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800'],
    description: 'Mira is a beautiful Indian street cat who loves attention and is very social. She is well-adapted to Indian homes.',
    healthStatus: 'Fully vaccinated, spayed, healthy',
    behaviorNotes: 'Indoor/outdoor cat, litter trained, affectionate, independent',
    specialNeeds: false,
    featured: true
  },
  {
    id: '3',
    name: 'Tommy',
    species: 'Dog',
    breed: 'Labrador Retriever',
    age: '3 years',
    ageCategory: 'Adult',
    size: 'Large',
    gender: 'Male',
    location: 'Bangalore, Karnataka',
    shelter: 'Bangalore Pet Rescue',
    shelterId: 's3',
    shelterVerified: true,
    images: ['https://images.unsplash.com/photo-1552053831-71594a27632d?w=800'],
    description: 'Tommy is a loyal and calm Labrador looking for a forever home. He is great for families and loves walks.',
    healthStatus: 'Vaccinated, neutered, microchipped',
    behaviorNotes: 'Calm temperament, well-trained, good with children',
    specialNeeds: false,
    featured: true
  },
  {
    id: '4',
    name: 'Simba',
    species: 'Cat',
    breed: 'Domestic Shorthair',
    age: '2 years',
    ageCategory: 'Adult',
    size: 'Small',
    gender: 'Male',
    location: 'Pune, Maharashtra',
    shelter: 'Pune Animal Shelter',
    shelterId: 's4',
    shelterVerified: true,
    images: ['https://images.unsplash.com/photo-1615789591457-74a63395c990?w=800'],
    description: 'Simba is a sweet and playful cat who enjoys both indoor time and supervised outdoor adventures.',
    healthStatus: 'Vaccinated, neutered, healthy',
    gender: 'Male',
    behaviorNotes: 'Playful, friendly, good with other pets',
    specialNeeds: false,
    featured: true
  },
  {
    id: '5',
    name: 'Sheru',
    species: 'Dog',
    breed: 'Indian Spitz',
    age: '4 years',
    ageCategory: 'Adult',
    size: 'Small',
    gender: 'Male',
    location: 'Hyderabad, Telangana',
    shelter: 'Hyderabad Dog Home',
    shelterId: 's5',
    shelterVerified: true,
    images: ['https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800'],
    description: 'Sheru is a fluffy and intelligent Indian Spitz, perfect for apartments. Very popular breed in India, known for being excellent companions.',
    healthStatus: 'Fully vaccinated, neutered, microchipped',
    behaviorNotes: 'Intelligent, alert, great for apartments, good watchdog',
    specialNeeds: false,
    featured: false
  },
  {
    id: '6',
    name: 'Mimi',
    species: 'Cat',
    breed: 'Persian Mix',
    age: '6 months',
    ageCategory: 'Puppy/Kitten',
    size: 'Small',
    gender: 'Female',
    location: 'Chennai, Tamil Nadu',
    shelter: 'Chennai Feline Friends',
    shelterId: 's6',
    shelterVerified: true,
    images: ['https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800'],
    description: 'Mimi is a playful kitten with a fluffy coat. She loves toys and is very affectionate.',
    healthStatus: 'Age-appropriate vaccines, scheduled spay',
    behaviorNotes: 'Playful, energetic, socialized with other cats',
    specialNeeds: false,
    featured: true
  },
  {
    id: '7',
    name: 'Bholu',
    species: 'Dog',
    breed: 'Rajapalayam',
    age: '3 years',
    ageCategory: 'Adult',
    size: 'Large',
    gender: 'Male',
    location: 'Madurai, Tamil Nadu',
    shelter: 'Tamil Nadu Dog Rescue',
    shelterId: 's7',
    shelterVerified: true,
    images: ['https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800'],
    description: 'Bholu is a majestic Rajapalayam, an ancient Indian sighthound breed. Loyal, protective and great for experienced owners.',
    healthStatus: 'Vaccinated, neutered, microchipped',
    behaviorNotes: 'Loyal, protective, needs experienced handler, active',
    specialNeeds: true,
    featured: false
  },
  {
    id: '8',
    name: 'Kitty',
    species: 'Cat',
    breed: 'Indian Tabby',
    age: '5 years',
    ageCategory: 'Adult',
    size: 'Small',
    gender: 'Female',
    location: 'Kolkata, West Bengal',
    shelter: 'Kolkata Cat Care',
    shelterId: 's8',
    shelterVerified: true,
    images: ['https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=800'],
    description: 'Kitty is a calm and loving tabby cat, perfect for someone looking for a gentle companion.',
    healthStatus: 'Vaccinated, spayed, healthy',
    behaviorNotes: 'Calm, quiet, prefers peaceful environment, affectionate',
    specialNeeds: false,
    featured: false
  },
  {
    id: '9',
    name: 'Moti',
    species: 'Dog',
    breed: 'Chippiparai',
    age: '2 years',
    ageCategory: 'Young',
    size: 'Medium',
    gender: 'Female',
    location: 'Coimbatore, Tamil Nadu',
    shelter: 'Coimbatore Animal Trust',
    shelterId: 's9',
    shelterVerified: true,
    images: ['https://images.unsplash.com/photo-1600077106724-946750eeaf3c?w=800'],
    description: 'Moti is a graceful Chippiparai, another ancient Indian sighthound. Athletic, loyal and excellent for active families.',
    healthStatus: 'Vaccinated, spayed, healthy',
    behaviorNotes: 'Athletic, loyal, needs exercise, great family dog',
    specialNeeds: false,
    featured: true
  },
  {
    id: '10',
    name: 'Kalu',
    species: 'Cat',
    breed: 'Black Indian Cat',
    age: '3 years',
    ageCategory: 'Adult',
    size: 'Medium',
    gender: 'Male',
    location: 'Jaipur, Rajasthan',
    shelter: 'Jaipur Pet Welfare',
    shelterId: 's10',
    shelterVerified: true,
    images: ['https://images.unsplash.com/photo-1516750484197-6a6e83e83a6e?w=800'],
    description: 'Kalu is a beautiful black cat with bright eyes. He is calm, loving and adapts well to home environments.',
    healthStatus: 'Vaccinated, neutered, microchipped',
    behaviorNotes: 'Calm, affectionate, good with other pets',
    specialNeeds: false,
    featured: false
  },
  {
    id: '11',
    name: 'Bruno',
    species: 'Dog',
    breed: 'Kombai',
    age: '3 years',
    ageCategory: 'Adult',
    size: 'Medium',
    gender: 'Male',
    location: 'Ahmedabad, Gujarat',
    shelter: 'Gujarat Animal Rescue',
    shelterId: 's11',
    shelterVerified: true,
    images: ['https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=800'],
    description: 'Bruno is a strong Kombai, a rare Indian breed known for their courage and loyalty. Needs experienced owner.',
    healthStatus: 'Fully vaccinated, neutered, healthy',
    behaviorNotes: 'Brave, loyal, protective, needs experienced handler',
    specialNeeds: true,
    featured: false
  },
  {
    id: '12',
    name: 'Meow',
    species: 'Cat',
    breed: 'Indian Mix',
    age: '1 year',
    ageCategory: 'Young',
    size: 'Small',
    gender: 'Female',
    location: 'Lucknow, Uttar Pradesh',
    shelter: 'UP Pet Care Society',
    shelterId: 's12',
    shelterVerified: true,
    images: ['https://images.unsplash.com/photo-1569591159212-b02ea8a9f239?w=800'],
    description: 'Meow is a sweet young cat who loves cuddles and playtime. Perfect for first-time cat owners.',
    healthStatus: 'Vaccinated, spayed, healthy',
    behaviorNotes: 'Sweet, playful, indoor cat, affectionate',
    specialNeeds: false,
    featured: true
  }
]

// Mock shelter data - Indian cities
const mockShelters: Shelter[] = [
  {
    id: 's1',
    name: 'Mumbai Animal Welfare',
    location: 'Andheri West, Mumbai, Maharashtra 400053',
    city: 'Mumbai',
    state: 'Maharashtra',
    distance: 3.5,
    verified: true,
    phone: '+91 22 2674 4700',
    email: 'info@mumbaianimalshelter.org',
    website: 'www.mumbaianimalshelter.org',
    description: 'Dedicated to rescuing and rehoming street dogs and Indian Pariah Dogs in Mumbai. We focus on providing comprehensive care and finding perfect matches for Indian families.',
    animalsAvailable: mockAnimals.filter(a => a.shelterId === 's1').length,
    image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800',
    operatingHours: 'Mon-Sat: 10am-6pm, Sun: 12pm-5pm',
    specialties: ['Indian Pariah Dogs', 'Street Dog Rescue', 'Vaccination Programs']
  },
  {
    id: 's2',
    name: 'Delhi Cat Rescue',
    location: 'Saket, New Delhi, NCR 110017',
    city: 'Delhi',
    state: 'NCR',
    distance: 5.2,
    verified: true,
    phone: '+91 11 4167 8900',
    email: 'contact@delhicatrescue.org',
    website: 'www.delhicatrescue.org',
    description: 'Premier cat rescue in Delhi NCR specializing in Indian street cats and domestic breeds. We provide medical care, spay/neuter services, and lifetime support.',
    animalsAvailable: mockAnimals.filter(a => a.shelterId === 's2').length,
    image: 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=800',
    operatingHours: 'Tue-Sun: 11am-7pm, Closed Mon',
    specialties: ['Cats', 'Street Cat Rescue', 'TNR Programs']
  },
  {
    id: 's3',
    name: 'Bangalore Pet Rescue',
    location: 'Indiranagar, Bangalore, Karnataka 560038',
    city: 'Bangalore',
    state: 'Karnataka',
    distance: 4.8,
    verified: true,
    phone: '+91 80 4112 5600',
    email: 'help@bangalorepets.org',
    website: 'www.bangalorepets.org',
    description: 'Giving abandoned pets a second chance in India\'s IT capital. We specialize in behavioral rehabilitation and adoption counseling.',
    animalsAvailable: mockAnimals.filter(a => a.shelterId === 's3').length,
    image: 'https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?w=800',
    operatingHours: 'Mon-Fri: 9am-6pm, Sat-Sun: 10am-5pm',
    specialties: ['All Breeds', 'Behavioral Training', 'Adoption Counseling']
  },
  {
    id: 's4',
    name: 'Pune Animal Shelter',
    location: 'Koregaon Park, Pune, Maharashtra 411001',
    city: 'Pune',
    state: 'Maharashtra',
    distance: 6.5,
    verified: true,
    phone: '+91 20 2613 7800',
    email: 'rescue@puneanimals.org',
    website: 'www.puneanimals.org',
    description: 'Community-focused shelter serving Pune and surrounding areas. We prioritize street animal welfare and adoption programs.',
    animalsAvailable: mockAnimals.filter(a => a.shelterId === 's4').length,
    image: 'https://images.unsplash.com/photo-1516750484197-6a6e83e83a6e?w=800',
    operatingHours: 'Wed-Sun: 12pm-6pm, Closed Mon-Tue',
    specialties: ['Cats', 'Dogs', 'Community Outreach']
  },
  {
    id: 's5',
    name: 'Hyderabad Dog Home',
    location: 'Banjara Hills, Hyderabad, Telangana 500034',
    city: 'Hyderabad',
    state: 'Telangana',
    distance: 7.2,
    verified: true,
    phone: '+91 40 2335 4400',
    email: 'info@hyderabaddoghome.org',
    website: 'www.hyderabaddoghome.org',
    description: 'Specializing in Indian Spitz and apartment-friendly breeds. Perfect for urban families in Hyderabad.',
    animalsAvailable: mockAnimals.filter(a => a.shelterId === 's5').length,
    image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=800',
    operatingHours: 'Sat-Sun: 10am-5pm, Weekday appointments available',
    specialties: ['Indian Spitz', 'Apartment Dogs', 'Training Programs']
  },
  {
    id: 's6',
    name: 'Chennai Feline Friends',
    location: 'Adyar, Chennai, Tamil Nadu 600020',
    city: 'Chennai',
    state: 'Tamil Nadu',
    distance: 8.3,
    verified: true,
    phone: '+91 44 2441 7200',
    email: 'adopt@chennaicats.org',
    website: 'www.chennaicats.org',
    description: 'Cat rescue with focus on kitten socialization and health. We offer adoption packages with starter supplies.',
    animalsAvailable: mockAnimals.filter(a => a.shelterId === 's6').length,
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800',
    operatingHours: 'Daily: 10am-7pm',
    specialties: ['Kittens', 'Young Cats', 'Adoption Support']
  },
  {
    id: 's7',
    name: 'Tamil Nadu Dog Rescue',
    location: 'Madurai, Tamil Nadu 625001',
    city: 'Madurai',
    state: 'Tamil Nadu',
    distance: 12.5,
    verified: true,
    phone: '+91 452 253 8900',
    email: 'contact@tndogrescue.org',
    website: 'www.tndogrescue.org',
    description: 'Specializing in native Indian breeds including Rajapalayam and Chippiparai. Preserving India\'s indigenous dog heritage.',
    animalsAvailable: mockAnimals.filter(a => a.shelterId === 's7').length,
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800',
    operatingHours: 'Thu-Mon: 11am-5pm, Closed Tue-Wed',
    specialties: ['Rajapalayam', 'Chippiparai', 'Indigenous Breeds']
  },
  {
    id: 's8',
    name: 'Kolkata Cat Care',
    location: 'Salt Lake, Kolkata, West Bengal 700091',
    city: 'Kolkata',
    state: 'West Bengal',
    distance: 9.8,
    verified: true,
    phone: '+91 33 2357 6100',
    email: 'care@kolkatacats.org',
    website: 'www.kolkatacats.org',
    description: 'Dedicated to cat welfare in Kolkata. We provide medical care, dental services, and lifetime support programs.',
    animalsAvailable: mockAnimals.filter(a => a.shelterId === 's8').length,
    image: 'https://images.unsplash.com/photo-1573865526739-10c1d3a1f0cc?w=800',
    operatingHours: 'Mon-Sat: 10am-6pm, Closed Sun',
    specialties: ['Cats', 'Medical Care', 'Senior Cat Care']
  },
  {
    id: 's9',
    name: 'Coimbatore Animal Trust',
    location: 'RS Puram, Coimbatore, Tamil Nadu 641002',
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    distance: 11.2,
    verified: true,
    phone: '+91 422 244 5300',
    email: 'info@coimbatorepets.org',
    website: 'www.coimbatorepets.org',
    description: 'Focused on Indian sighthounds and athletic breeds. Perfect for active families in Tamil Nadu.',
    animalsAvailable: mockAnimals.filter(a => a.shelterId === 's9').length,
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800',
    operatingHours: 'Tue-Sat: 12pm-7pm, Sun: 12pm-5pm, Closed Mon',
    specialties: ['Chippiparai', 'Sighthounds', 'Athletic Breeds']
  },
  {
    id: 's10',
    name: 'Jaipur Pet Welfare',
    location: 'C-Scheme, Jaipur, Rajasthan 302001',
    city: 'Jaipur',
    state: 'Rajasthan',
    distance: 10.5,
    verified: true,
    phone: '+91 141 237 8800',
    email: 'adopt@jaipurpets.org',
    website: 'www.jaipurpets.org',
    description: 'Comprehensive pet welfare in Rajasthan. We focus on education and celebrating all pets including black cats.',
    animalsAvailable: mockAnimals.filter(a => a.shelterId === 's10').length,
    image: 'https://images.unsplash.com/photo-1529778873920-4da4926a72c2?w=800',
    operatingHours: 'Wed-Sun: 11am-6pm, Closed Mon-Tue',
    specialties: ['All Pets', 'Education Programs', 'Community Events']
  },
  {
    id: 's11',
    name: 'Gujarat Animal Rescue',
    location: 'Satellite, Ahmedabad, Gujarat 380015',
    city: 'Ahmedabad',
    state: 'Gujarat',
    distance: 13.8,
    verified: true,
    phone: '+91 79 2630 5500',
    email: 'hello@gujaratrescue.org',
    website: 'www.gujaratrescue.org',
    description: 'Breed-specific rescue for Kombai and rare Indian breeds. We provide training resources and breed education.',
    animalsAvailable: mockAnimals.filter(a => a.shelterId === 's11').length,
    image: 'https://images.unsplash.com/photo-1597633425046-08f5110420f5?w=800',
    operatingHours: 'Sat-Sun: 10am-6pm, Weekday visits by appointment',
    specialties: ['Kombai', 'Rare Breeds', 'Training Classes']
  },
  {
    id: 's12',
    name: 'UP Pet Care Society',
    location: 'Gomti Nagar, Lucknow, Uttar Pradesh 226010',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    distance: 14.5,
    verified: true,
    phone: '+91 522 404 6700',
    email: 'contact@uppetcare.org',
    website: 'www.uppetcare.org',
    description: 'Caring for all breeds with special focus on first-time pet parents. We provide grooming education and ongoing support.',
    animalsAvailable: mockAnimals.filter(a => a.shelterId === 's12').length,
    image: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=800',
    operatingHours: 'Mon-Sat: 10am-7pm, Sun: 11am-5pm',
    specialties: ['All Breeds', 'First-Time Owners', 'Grooming Education']
  }
]

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<'home' | 'browse' | 'shelters' | 'profile' | 'chat'>('home')
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null)
  const [selectedShelter, setSelectedShelter] = useState<Shelter | null>(null)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [userLocation, setUserLocation] = useState('Mumbai, Maharashtra')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterSpecies, setFilterSpecies] = useState<'all' | 'Dog' | 'Cat' | 'Rabbit'>('all')
  const [filterSize, setFilterSize] = useState<'all' | 'Small' | 'Medium' | 'Large'>('all')
  const [filterAge, setFilterAge] = useState<'all' | 'Puppy/Kitten' | 'Young' | 'Adult' | 'Senior'>('all')
  const [filterSpecialNeeds, setFilterSpecialNeeds] = useState(false)
  const [showMatchModal, setShowMatchModal] = useState(false)
  const [matchFormData, setMatchFormData] = useState({
    living: '',
    experience: '',
    activity: '',
    time: ''
  })
  const [matchResults, setMatchResults] = useState<RecommendedAnimal[]>([])
  const [matchLoading, setMatchLoading] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [profileTab, setProfileTab] = useState<'saved' | 'applications' | 'settings'>('saved')
  const [applications, setApplications] = useState<Application[]>([
    {
      id: 'app1',
      animalId: '1',
      animalName: 'Charlie',
      animalImage: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=800',
      status: 'reviewing',
      submittedDate: '2026-01-28'
    },
    {
      id: 'app2',
      animalId: '2',
      animalName: 'Luna',
      animalImage: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=800',
      status: 'pending',
      submittedDate: '2026-02-01'
    }
  ])
  const [featuredIndex, setFeaturedIndex] = useState(0)
  const [adoptionCount, setAdoptionCount] = useState(0)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showFilters, setShowFilters] = useState(false)

  // Animated adoption counter
  useEffect(() => {
    const target = 1247
    const duration = 2000
    const increment = target / (duration / 50)
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setAdoptionCount(target)
        clearInterval(timer)
      } else {
        setAdoptionCount(Math.floor(current))
      }
    }, 50)
    return () => clearInterval(timer)
  }, [])

  // Featured carousel auto-advance
  useEffect(() => {
    const featuredAnimals = mockAnimals.filter(a => a.featured)
    const timer = setInterval(() => {
      setFeaturedIndex(prev => (prev + 1) % featuredAnimals.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const toggleFavorite = (animalId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(animalId)) {
        newFavorites.delete(animalId)
      } else {
        newFavorites.add(animalId)
      }
      return newFavorites
    })
  }

  const filteredAnimals = mockAnimals.filter(animal => {
    if (filterSpecies !== 'all' && animal.species !== filterSpecies) return false
    if (filterSize !== 'all' && animal.size !== filterSize) return false
    if (filterAge !== 'all' && animal.ageCategory !== filterAge) return false
    if (filterSpecialNeeds && !animal.specialNeeds) return false
    if (searchQuery && !animal.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !animal.breed.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const handleFindMyMatch = async () => {
    setMatchLoading(true)
    const message = `I ${matchFormData.living}, have ${matchFormData.experience} experience with pets, prefer ${matchFormData.activity} activity level, and have ${matchFormData.time} time availability.`

    try {
      const result = await callAIAgent(message, '698583860ee88347863f0709')
      if (result.success && result.response.status === 'success') {
        const response = result.response as PetMatchingResponse
        setMatchResults(response.result.recommended_animals || [])
      }
    } catch (error) {
      console.error('Match error:', error)
    }
    setMatchLoading(false)
  }

  const handleSendChatMessage = async (message?: string) => {
    const messageToSend = message || chatInput
    if (!messageToSend.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: messageToSend,
      timestamp: new Date()
    }
    setChatMessages(prev => [...prev, userMessage])
    setChatInput('')
    setChatLoading(true)

    try {
      const result = await callAIAgent(messageToSend, '6985839e382ef8715224cf0f')
      if (result.success && result.response.status === 'success') {
        const response = result.response as AdoptionGuideResponse
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.result.guidance_message,
          tips: response.result.actionable_tips,
          resources: response.result.relevant_resources,
          timestamp: new Date()
        }
        setChatMessages(prev => [...prev, assistantMessage])
      }
    } catch (error) {
      console.error('Chat error:', error)
    }
    setChatLoading(false)
  }

  const handleApplyToAdopt = (animal: Animal) => {
    const newApplication: Application = {
      id: `app${Date.now()}`,
      animalId: animal.id,
      animalName: animal.name,
      animalImage: animal.images[0],
      status: 'pending',
      submittedDate: new Date().toISOString().split('T')[0]
    }
    setApplications(prev => [...prev, newApplication])
    setSelectedAnimal(null)
    setCurrentScreen('profile')
    setProfileTab('applications')
  }

  // Home Screen Component
  const HomeScreen = () => {
    const featuredAnimals = mockAnimals.filter(a => a.featured)
    const currentFeatured = featuredAnimals[featuredIndex % featuredAnimals.length]

    return (
      <div className="pb-20 overflow-y-auto h-full">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-[#FF6B6B] to-[#FF8E8E] text-white px-6 py-12 text-center">
          <div className="max-w-2xl mx-auto">
            <FaPaw className="text-6xl mx-auto mb-4 opacity-90" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Pawfect Companion</h1>
            <p className="text-lg mb-6 opacity-90">Connect with rescue animals waiting for their forever home</p>
            <div className="relative max-w-md mx-auto">
              <Input
                placeholder="Search by name or breed..."
                className="pl-12 h-12 text-lg bg-white/95 border-0"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setCurrentScreen('browse')}
              />
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
            </div>
          </div>
        </div>

        {/* Featured Animals Carousel */}
        <div className="px-6 py-8 bg-[#FFF9F5]">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Featured Animals</h2>
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {featuredAnimals.slice(featuredIndex, featuredIndex + 3).map((animal) => (
                <Card
                  key={animal.id}
                  className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setSelectedAnimal(animal)}
                >
                  <div className="relative h-48">
                    <img src={animal.images[0]} alt={animal.name} className="w-full h-full object-cover" />
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFavorite(animal.id)
                      }}
                      className="absolute top-3 right-3 bg-white/90 p-2 rounded-full hover:bg-white transition-colors"
                    >
                      {favorites.has(animal.id) ? (
                        <FaHeart className="text-[#FF6B6B] text-xl" />
                      ) : (
                        <FaRegHeart className="text-gray-600 text-xl" />
                      )}
                    </button>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{animal.name}</h3>
                    <p className="text-gray-600 mb-2">{animal.breed}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <FaMapMarkerAlt className="mr-1" />
                      <span>{animal.location}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Impact Counter */}
        <div className="px-6 py-12 bg-[#2D5A4A] text-white text-center">
          <h2 className="text-3xl font-bold mb-2">{adoptionCount.toLocaleString()}</h2>
          <p className="text-lg opacity-90">Successful Adoptions This Year</p>
          <p className="text-sm mt-2 opacity-75">Join our community of happy pet parents</p>
        </div>

        {/* CTA Buttons */}
        <div className="px-6 py-8 bg-[#FFF9F5] grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            onClick={() => setCurrentScreen('browse')}
            className="h-16 text-lg bg-[#FF6B6B] hover:bg-[#FF5555] text-white"
          >
            <FaSearch className="mr-2" />
            Browse Animals
          </Button>
          <Button
            onClick={() => setCurrentScreen('chat')}
            className="h-16 text-lg bg-[#2D5A4A] hover:bg-[#234536] text-white"
          >
            <FaComments className="mr-2" />
            Get Adoption Guide
          </Button>
        </div>
      </div>
    )
  }

  // Browse Screen Component
  const BrowseScreen = () => {
    return (
      <div className="pb-20 overflow-y-auto h-full bg-[#FFF9F5]">
        {/* Search Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
          <div className="relative mb-3">
            <Input
              placeholder="Search by name or breed..."
              className="pl-12 h-12"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="w-full"
          >
            <FaFilter className="mr-2" />
            Filters {(filterSpecies !== 'all' || filterSize !== 'all' || filterAge !== 'all' || filterSpecialNeeds) && '(Active)'}
          </Button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white border-b border-gray-200 px-6 py-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Species</label>
              <div className="flex gap-2">
                {(['all', 'Dog', 'Cat', 'Rabbit'] as const).map(s => (
                  <Button
                    key={s}
                    variant={filterSpecies === s ? 'default' : 'outline'}
                    onClick={() => setFilterSpecies(s)}
                    size="sm"
                    className={filterSpecies === s ? 'bg-[#FF6B6B] hover:bg-[#FF5555]' : ''}
                  >
                    {s === 'all' ? 'All' : s}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
              <div className="flex gap-2">
                {(['all', 'Small', 'Medium', 'Large'] as const).map(s => (
                  <Button
                    key={s}
                    variant={filterSize === s ? 'default' : 'outline'}
                    onClick={() => setFilterSize(s)}
                    size="sm"
                    className={filterSize === s ? 'bg-[#FF6B6B] hover:bg-[#FF5555]' : ''}
                  >
                    {s === 'all' ? 'All' : s}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
              <div className="flex gap-2 flex-wrap">
                {(['all', 'Puppy/Kitten', 'Young', 'Adult', 'Senior'] as const).map(a => (
                  <Button
                    key={a}
                    variant={filterAge === a ? 'default' : 'outline'}
                    onClick={() => setFilterAge(a)}
                    size="sm"
                    className={filterAge === a ? 'bg-[#FF6B6B] hover:bg-[#FF5555]' : ''}
                  >
                    {a === 'all' ? 'All Ages' : a}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="specialNeeds"
                checked={filterSpecialNeeds}
                onChange={(e) => setFilterSpecialNeeds(e.target.checked)}
                className="mr-2 h-4 w-4 text-[#FF6B6B] rounded"
              />
              <label htmlFor="specialNeeds" className="text-sm font-medium text-gray-700">
                Special Needs Only
              </label>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setFilterSpecies('all')
                setFilterSize('all')
                setFilterAge('all')
                setFilterSpecialNeeds(false)
              }}
              className="w-full"
            >
              Clear All Filters
            </Button>
          </div>
        )}

        {/* Results Count */}
        <div className="px-6 py-3 bg-gray-50">
          <p className="text-sm text-gray-600">
            Showing {filteredAnimals.length} {filteredAnimals.length === 1 ? 'animal' : 'animals'}
          </p>
        </div>

        {/* Animals Grid */}
        <div className="px-6 py-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredAnimals.map(animal => (
            <Card
              key={animal.id}
              className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedAnimal(animal)}
            >
              <div className="relative aspect-square">
                <img src={animal.images[0]} alt={animal.name} className="w-full h-full object-cover" />
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleFavorite(animal.id)
                  }}
                  className="absolute top-2 right-2 bg-white/90 p-2 rounded-full hover:bg-white transition-colors"
                >
                  {favorites.has(animal.id) ? (
                    <FaHeart className="text-[#FF6B6B]" />
                  ) : (
                    <FaRegHeart className="text-gray-600" />
                  )}
                </button>
                {animal.specialNeeds && (
                  <div className="absolute top-2 left-2 bg-[#2D5A4A] text-white text-xs px-2 py-1 rounded">
                    Special Needs
                  </div>
                )}
              </div>
              <CardContent className="p-3">
                <h3 className="font-bold text-gray-800 mb-1">{animal.name}</h3>
                <p className="text-sm text-gray-600 mb-1">{animal.age}</p>
                <p className="text-xs text-gray-500">{animal.breed}</p>
                <div className="flex items-center text-xs text-gray-500 mt-2">
                  <FaMapMarkerAlt className="mr-1" />
                  <span className="truncate">{animal.location}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Floating Match Button */}
        <div className="fixed bottom-24 right-6 z-20">
          <Button
            onClick={() => setShowMatchModal(true)}
            className="h-14 px-6 bg-[#2D5A4A] hover:bg-[#234536] text-white rounded-full shadow-lg"
          >
            <FaStar className="mr-2" />
            Find My Match
          </Button>
        </div>
      </div>
    )
  }

  // Animal Profile Modal
  const AnimalProfileModal = ({ animal }: { animal: Animal }) => {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center">
        <div className="bg-white w-full md:max-w-3xl md:rounded-lg overflow-hidden max-h-[90vh] overflow-y-auto">
          {/* Image Gallery */}
          <div className="relative h-80">
            <img
              src={animal.images[currentImageIndex]}
              alt={animal.name}
              className="w-full h-full object-cover"
            />
            {animal.images.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImageIndex(prev =>
                    prev === 0 ? animal.images.length - 1 : prev - 1
                  )}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-3 rounded-full"
                >
                  <FaChevronLeft />
                </button>
                <button
                  onClick={() => setCurrentImageIndex(prev =>
                    prev === animal.images.length - 1 ? 0 : prev + 1
                  )}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-3 rounded-full"
                >
                  <FaChevronRight />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {animal.images.map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-2 h-2 rounded-full ${idx === currentImageIndex ? 'bg-white' : 'bg-white/50'}`}
                    />
                  ))}
                </div>
              </>
            )}
            <button
              onClick={() => {
                setSelectedAnimal(null)
                setCurrentImageIndex(0)
              }}
              className="absolute top-4 right-4 bg-white/90 p-3 rounded-full"
            >
              <FaTimes />
            </button>
          </div>

          {/* Quick Stats Bar */}
          <div className="grid grid-cols-4 gap-4 px-6 py-4 bg-gray-50 border-b">
            <div className="text-center">
              <FaBirthdayCake className="text-[#FF6B6B] mx-auto mb-1" />
              <p className="text-xs text-gray-600">{animal.age}</p>
            </div>
            <div className="text-center">
              <FaRuler className="text-[#FF6B6B] mx-auto mb-1" />
              <p className="text-xs text-gray-600">{animal.size}</p>
            </div>
            <div className="text-center">
              <FaVenusMars className="text-[#FF6B6B] mx-auto mb-1" />
              <p className="text-xs text-gray-600">{animal.gender}</p>
            </div>
            <div className="text-center">
              {animal.species === 'Dog' ? <FaDog className="text-[#FF6B6B] mx-auto mb-1" /> : <FaCat className="text-[#FF6B6B] mx-auto mb-1" />}
              <p className="text-xs text-gray-600">{animal.breed}</p>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-800">{animal.name}</h2>
                <p className="text-gray-600">{animal.breed}</p>
              </div>
              <button
                onClick={() => toggleFavorite(animal.id)}
                className="p-3 rounded-full bg-gray-100 hover:bg-gray-200"
              >
                {favorites.has(animal.id) ? (
                  <FaHeart className="text-[#FF6B6B] text-2xl" />
                ) : (
                  <FaRegHeart className="text-gray-600 text-2xl" />
                )}
              </button>
            </div>

            {/* Tabs */}
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-gray-800 mb-2">About</h3>
                <p className="text-gray-600">{animal.description}</p>
              </div>

              <div>
                <h3 className="font-bold text-gray-800 mb-2">Health</h3>
                <p className="text-gray-600">{animal.healthStatus}</p>
              </div>

              <div>
                <h3 className="font-bold text-gray-800 mb-2">Behavior</h3>
                <p className="text-gray-600">{animal.behaviorNotes}</p>
              </div>

              <div>
                <h3 className="font-bold text-gray-800 mb-2">Shelter</h3>
                <Card className="bg-gray-50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-gray-800">{animal.shelter}</p>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <FaMapMarkerAlt className="mr-1" />
                          <span>{animal.location}</span>
                        </div>
                      </div>
                      {animal.shelterVerified && (
                        <div className="flex items-center text-[#2D5A4A] text-sm">
                          <FaCheckCircle className="mr-1" />
                          <span>Verified</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Fixed Bottom CTA */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
            <Button
              onClick={() => handleApplyToAdopt(animal)}
              className="w-full h-12 bg-[#FF6B6B] hover:bg-[#FF5555] text-white text-lg"
            >
              Apply to Adopt {animal.name}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Match Modal
  const MatchModal = () => {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center">
        <div className="bg-white w-full md:max-w-2xl md:rounded-lg overflow-hidden max-h-[90vh] overflow-y-auto">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Find Your Perfect Match</h2>
            <button
              onClick={() => {
                setShowMatchModal(false)
                setMatchResults([])
              }}
              className="p-2"
            >
              <FaTimes />
            </button>
          </div>

          {matchResults.length === 0 ? (
            <div className="px-6 py-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Living Situation</label>
                <Input
                  placeholder="e.g., live in a small apartment"
                  value={matchFormData.living}
                  onChange={(e) => setMatchFormData(prev => ({ ...prev, living: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
                <Input
                  placeholder="e.g., moderate experience with pets"
                  value={matchFormData.experience}
                  onChange={(e) => setMatchFormData(prev => ({ ...prev, experience: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Activity Preference</label>
                <Input
                  placeholder="e.g., calm and relaxed"
                  value={matchFormData.activity}
                  onChange={(e) => setMatchFormData(prev => ({ ...prev, activity: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time Availability</label>
                <Input
                  placeholder="e.g., work from home 3 days a week"
                  value={matchFormData.time}
                  onChange={(e) => setMatchFormData(prev => ({ ...prev, time: e.target.value }))}
                />
              </div>
              <Button
                onClick={handleFindMyMatch}
                disabled={matchLoading || !matchFormData.living || !matchFormData.experience}
                className="w-full h-12 bg-[#FF6B6B] hover:bg-[#FF5555] text-white"
              >
                {matchLoading ? 'Finding Matches...' : 'Find My Matches'}
              </Button>
            </div>
          ) : (
            <div className="px-6 py-6 space-y-4">
              <h3 className="text-xl font-bold text-gray-800">Your Matches</h3>
              {matchResults.map((match, idx) => (
                <Card key={idx} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-lg font-bold text-gray-800">{match.animal_name}</h4>
                        <p className="text-sm text-gray-600">{match.breed} - {match.age}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-[#2D5A4A]">{match.compatibility_percentage}%</div>
                        <p className="text-xs text-gray-500">Match</p>
                      </div>
                    </div>
                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-700 mb-1">Why this match:</p>
                      <ul className="space-y-1">
                        {match.match_reasons.map((reason, ridx) => (
                          <li key={ridx} className="text-sm text-gray-600 flex items-start">
                            <FaCheckCircle className="text-[#2D5A4A] mt-1 mr-2 flex-shrink-0" />
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Care considerations:</p>
                      <ul className="space-y-1">
                        {match.care_considerations.map((care, cidx) => (
                          <li key={cidx} className="text-sm text-gray-600 flex items-start">
                            <span className="mr-2">•</span>
                            <span>{care}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button
                onClick={() => {
                  setShowMatchModal(false)
                  setMatchResults([])
                  setMatchFormData({ living: '', experience: '', activity: '', time: '' })
                }}
                variant="outline"
                className="w-full"
              >
                Close
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Chat Screen Component
  const ChatScreen = () => {
    const quickActions = [
      "First-time tips",
      "Prepare my home",
      "Post-adoption care",
      "Breed info"
    ]

    return (
      <div className="h-full flex flex-col bg-[#FFF9F5]">
        {/* Chat Header */}
        <div className="bg-[#2D5A4A] text-white px-6 py-4">
          <h2 className="text-xl font-bold">Adoption Guide</h2>
          <p className="text-sm opacity-90">Get expert advice for your adoption journey</p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {chatMessages.length === 0 && (
            <div className="text-center py-8">
              <FaComments className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Ask me anything about pet adoption!</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {quickActions.map(action => (
                  <Button
                    key={action}
                    onClick={() => handleSendChatMessage(`Tell me about: ${action}`)}
                    variant="outline"
                    size="sm"
                  >
                    {action}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {chatMessages.map(msg => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] ${msg.role === 'user' ? 'bg-[#FF6B6B] text-white' : 'bg-white'} rounded-lg px-4 py-3 shadow`}>
                <p className={msg.role === 'user' ? 'text-white' : 'text-gray-800'}>{msg.content}</p>

                {msg.tips && msg.tips.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="font-medium text-sm text-gray-700">Actionable Tips:</p>
                    {msg.tips.map((tip, idx) => (
                      <Card key={idx} className="bg-[#FFF9F5]">
                        <CardContent className="p-3 text-sm text-gray-700">
                          <div className="flex items-start">
                            <FaCheckCircle className="text-[#2D5A4A] mt-0.5 mr-2 flex-shrink-0" />
                            <span>{tip}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {msg.resources && msg.resources.length > 0 && (
                  <div className="mt-3 space-y-1">
                    <p className="font-medium text-sm text-gray-700">Resources:</p>
                    {msg.resources.map((resource, idx) => (
                      <p key={idx} className="text-sm text-[#2D5A4A] underline cursor-pointer">
                        {resource}
                      </p>
                    ))}
                  </div>
                )}

                <p className="text-xs opacity-60 mt-2">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}

          {chatLoading && (
            <div className="flex justify-start">
              <div className="bg-white rounded-lg px-4 py-3 shadow">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="bg-white border-t border-gray-200 px-6 py-4 pb-24">
          <div className="flex gap-2">
            <Input
              placeholder="Ask about adoption, preparation, care..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendChatMessage()}
              className="flex-1"
            />
            <Button
              onClick={() => handleSendChatMessage()}
              disabled={!chatInput.trim() || chatLoading}
              className="bg-[#FF6B6B] hover:bg-[#FF5555] text-white"
            >
              <FaPaperPlane />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Shelters Screen Component
  const SheltersScreen = () => {
    const sortedShelters = [...mockShelters].sort((a, b) => a.distance - b.distance)

    return (
      <div className="pb-20 overflow-y-auto h-full bg-[#FFF9F5]">
        {/* Header */}
        <div className="bg-gradient-to-br from-[#2D5A4A] to-[#3a7259] text-white px-6 py-8">
          <FaBuilding className="text-5xl mx-auto mb-3 opacity-90" />
          <h1 className="text-3xl font-bold text-center mb-2">Shelters Near You</h1>
          <div className="flex items-center justify-center text-sm opacity-90">
            <FaMapMarkerAlt className="mr-2" />
            <span>{userLocation}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <p className="text-sm text-gray-600 text-center">
            {sortedShelters.length} verified shelters with {mockAnimals.length} animals available for adoption
          </p>
        </div>

        {/* Shelters List */}
        <div className="px-6 py-4 space-y-4">
          {sortedShelters.map(shelter => {
            const shelterAnimals = mockAnimals.filter(a => a.shelterId === shelter.id)
            return (
              <Card
                key={shelter.id}
                className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedShelter(shelter)}
              >
                <div className="flex gap-4 p-4">
                  <div className="w-24 h-24 flex-shrink-0">
                    <img src={shelter.image} alt={shelter.name} className="w-full h-full object-cover rounded-lg" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-800 mb-1">{shelter.name}</h3>
                        {shelter.verified && (
                          <div className="flex items-center text-[#2D5A4A] text-xs mb-2">
                            <FaCheckCircle className="mr-1" />
                            <span>Verified</span>
                          </div>
                        )}
                      </div>
                      <div className="text-right ml-2">
                        <div className="text-sm font-bold text-[#FF6B6B]">{shelter.distance} km</div>
                        <div className="text-xs text-gray-500">away</div>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <FaMapMarkerAlt className="mr-1 flex-shrink-0" />
                      <span className="truncate">{shelter.city}, {shelter.state}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-[#2D5A4A] font-medium">
                        {shelter.animalsAvailable} {shelter.animalsAvailable === 1 ? 'animal' : 'animals'} available
                      </span>
                      {shelterAnimals.length > 0 && (
                        <div className="flex -space-x-2">
                          {shelterAnimals.slice(0, 3).map(animal => (
                            <div key={animal.id} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden">
                              <img src={animal.images[0]} alt={animal.name} className="w-full h-full object-cover" />
                            </div>
                          ))}
                          {shelterAnimals.length > 3 && (
                            <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                              +{shelterAnimals.length - 3}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="px-4 pb-3">
                  <div className="flex gap-2 flex-wrap">
                    {shelter.specialties.slice(0, 3).map(specialty => (
                      <span key={specialty} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    )
  }

  // Shelter Detail Modal
  const ShelterDetailModal = ({ shelter }: { shelter: Shelter }) => {
    const shelterAnimals = mockAnimals.filter(a => a.shelterId === shelter.id)

    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center">
        <div className="bg-white w-full md:max-w-3xl md:rounded-lg overflow-hidden max-h-[90vh] overflow-y-auto">
          {/* Header Image */}
          <div className="relative h-48">
            <img src={shelter.image} alt={shelter.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <button
              onClick={() => setSelectedShelter(null)}
              className="absolute top-4 right-4 bg-white/90 p-3 rounded-full"
            >
              <FaTimes />
            </button>
            {shelter.verified && (
              <div className="absolute top-4 left-4 bg-[#2D5A4A] text-white px-3 py-1 rounded-full flex items-center text-sm">
                <FaCheckCircle className="mr-1" />
                <span>Verified Shelter</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            {/* Name and Distance */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">{shelter.name}</h2>
                <div className="flex items-center text-gray-600 mb-2">
                  <FaMapMarkerAlt className="mr-2" />
                  <span>{shelter.location}</span>
                </div>
                <div className="text-[#FF6B6B] font-medium">{shelter.distance} kilometers from you</div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <p className="text-gray-600">{shelter.description}</p>
            </div>

            {/* Contact Info */}
            <div className="mb-6 space-y-3">
              <h3 className="font-bold text-gray-800 mb-3">Contact Information</h3>
              <div className="flex items-center text-gray-600">
                <FaPhone className="mr-3 text-[#FF6B6B]" />
                <a href={`tel:${shelter.phone}`} className="hover:text-[#FF6B6B]">{shelter.phone}</a>
              </div>
              <div className="flex items-center text-gray-600">
                <FaEnvelope className="mr-3 text-[#FF6B6B]" />
                <a href={`mailto:${shelter.email}`} className="hover:text-[#FF6B6B]">{shelter.email}</a>
              </div>
              <div className="flex items-center text-gray-600">
                <FaGlobe className="mr-3 text-[#FF6B6B]" />
                <a href={`https://${shelter.website}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#FF6B6B]">
                  {shelter.website}
                </a>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="mb-6">
              <h3 className="font-bold text-gray-800 mb-2">Operating Hours</h3>
              <p className="text-gray-600">{shelter.operatingHours}</p>
            </div>

            {/* Specialties */}
            <div className="mb-6">
              <h3 className="font-bold text-gray-800 mb-3">Specialties</h3>
              <div className="flex gap-2 flex-wrap">
                {shelter.specialties.map(specialty => (
                  <span key={specialty} className="px-3 py-1 bg-[#2D5A4A] text-white rounded-full text-sm">
                    {specialty}
                  </span>
                ))}
              </div>
            </div>

            {/* Available Animals */}
            {shelterAnimals.length > 0 && (
              <div className="mb-6">
                <h3 className="font-bold text-gray-800 mb-3">
                  Available Animals ({shelterAnimals.length})
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {shelterAnimals.map(animal => (
                    <Card
                      key={animal.id}
                      className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => {
                        setSelectedShelter(null)
                        setSelectedAnimal(animal)
                      }}
                    >
                      <div className="relative aspect-square">
                        <img src={animal.images[0]} alt={animal.name} className="w-full h-full object-cover" />
                      </div>
                      <CardContent className="p-3">
                        <h4 className="font-bold text-gray-800 text-sm">{animal.name}</h4>
                        <p className="text-xs text-gray-600">{animal.breed}</p>
                        <p className="text-xs text-gray-500 mt-1">{animal.age}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4">
            <Button
              onClick={() => setCurrentScreen('browse')}
              className="w-full h-12 bg-[#FF6B6B] hover:bg-[#FF5555] text-white"
            >
              Browse All Animals at {shelter.name}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Profile Screen Component
  const ProfileScreen = () => {
    const savedAnimals = mockAnimals.filter(a => favorites.has(a.id))

    const getStatusColor = (status: Application['status']) => {
      switch (status) {
        case 'pending': return 'bg-yellow-100 text-yellow-800'
        case 'reviewing': return 'bg-blue-100 text-blue-800'
        case 'approved': return 'bg-green-100 text-green-800'
        case 'rejected': return 'bg-red-100 text-red-800'
      }
    }

    const getStatusIcon = (status: Application['status']) => {
      switch (status) {
        case 'pending': return <FaClock />
        case 'reviewing': return <FaEye />
        case 'approved': return <FaCheckCircle />
        default: return <FaTimes />
      }
    }

    return (
      <div className="pb-20 overflow-y-auto h-full bg-[#FFF9F5]">
        {/* Profile Header */}
        <div className="bg-[#2D5A4A] text-white px-6 py-8 text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full mx-auto mb-3 flex items-center justify-center">
            <FaUser className="text-4xl" />
          </div>
          <h2 className="text-2xl font-bold">My Profile</h2>
        </div>

        {/* Tabs */}
        <div className="bg-white border-b border-gray-200 px-6 flex">
          {(['saved', 'applications', 'settings'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setProfileTab(tab)}
              className={`flex-1 py-4 text-sm font-medium capitalize ${
                profileTab === tab
                  ? 'text-[#FF6B6B] border-b-2 border-[#FF6B6B]'
                  : 'text-gray-500'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="px-6 py-4">
          {profileTab === 'saved' && (
            <>
              {savedAnimals.length === 0 ? (
                <div className="text-center py-12">
                  <FaRegHeart className="text-6xl text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No saved animals yet</p>
                  <Button onClick={() => setCurrentScreen('browse')} className="bg-[#FF6B6B] hover:bg-[#FF5555] text-white">
                    Browse Animals
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {savedAnimals.map(animal => (
                    <Card
                      key={animal.id}
                      className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => setSelectedAnimal(animal)}
                    >
                      <div className="relative aspect-square">
                        <img src={animal.images[0]} alt={animal.name} className="w-full h-full object-cover" />
                      </div>
                      <CardContent className="p-3">
                        <h3 className="font-bold text-gray-800">{animal.name}</h3>
                        <p className="text-sm text-gray-600">{animal.breed}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}

          {profileTab === 'applications' && (
            <>
              {applications.length === 0 ? (
                <div className="text-center py-12">
                  <FaPaw className="text-6xl text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No applications submitted yet</p>
                  <Button onClick={() => setCurrentScreen('browse')} className="bg-[#FF6B6B] hover:bg-[#FF5555] text-white">
                    Find Your Match
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.map(app => (
                    <Card key={app.id}>
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <img
                            src={app.animalImage}
                            alt={app.animalName}
                            className="w-20 h-20 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-800 mb-1">{app.animalName}</h3>
                            <p className="text-sm text-gray-500 mb-2">
                              Submitted: {new Date(app.submittedDate).toLocaleDateString()}
                            </p>
                            <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${getStatusColor(app.status)}`}>
                              {getStatusIcon(app.status)}
                              <span className="capitalize">{app.status}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}

          {profileTab === 'settings' && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Notifications</label>
                    <p className="text-sm text-gray-500">Receive updates about your applications</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location Preferences</label>
                    <Input placeholder="Enter your city" defaultValue="Mumbai, Maharashtra" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Bottom Navigation
  const BottomNav = () => {
    const navItems = [
      { id: 'home' as const, icon: FaHome, label: 'Home' },
      { id: 'browse' as const, icon: FaSearch, label: 'Animals' },
      { id: 'shelters' as const, icon: FaBuilding, label: 'Shelters' },
      { id: 'chat' as const, icon: FaComments, label: 'Guide' },
      { id: 'profile' as const, icon: FaUser, label: 'Profile' },
    ]

    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-30">
        <div className="flex justify-around">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentScreen(item.id)}
              className={`flex flex-col items-center py-2 px-4 ${
                currentScreen === item.id ? 'text-[#FF6B6B]' : 'text-gray-500'
              }`}
            >
              <item.icon className="text-xl mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-[#FFF9F5]">
      <div className="flex-1 overflow-hidden">
        {currentScreen === 'home' && <HomeScreen />}
        {currentScreen === 'browse' && <BrowseScreen />}
        {currentScreen === 'shelters' && <SheltersScreen />}
        {currentScreen === 'chat' && <ChatScreen />}
        {currentScreen === 'profile' && <ProfileScreen />}
      </div>

      <BottomNav />

      {selectedAnimal && <AnimalProfileModal animal={selectedAnimal} />}
      {selectedShelter && <ShelterDetailModal shelter={selectedShelter} />}
      {showMatchModal && <MatchModal />}
    </div>
  )
}
