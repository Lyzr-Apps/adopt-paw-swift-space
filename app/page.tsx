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
  distance: number // in miles
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

// Mock animal data
const mockAnimals: Animal[] = [
  {
    id: '1',
    name: 'Charlie',
    species: 'Dog',
    breed: 'Golden Retriever',
    age: '2 years',
    ageCategory: 'Young',
    size: 'Large',
    gender: 'Male',
    location: 'San Francisco, CA',
    shelter: 'Happy Paws Rescue',
    shelterId: 's1',
    shelterVerified: true,
    images: ['https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=800', 'https://images.unsplash.com/photo-1558788353-f76d92427f16?w=800'],
    description: 'Charlie is a friendly and energetic Golden Retriever who loves to play fetch and go on long walks. He\'s great with kids and other dogs.',
    healthStatus: 'Fully vaccinated, neutered, microchipped',
    behaviorNotes: 'Well-trained, knows basic commands, house-trained, gentle with children',
    specialNeeds: false,
    featured: true
  },
  {
    id: '2',
    name: 'Luna',
    species: 'Cat',
    breed: 'Siamese',
    age: '1 year',
    ageCategory: 'Young',
    size: 'Small',
    gender: 'Female',
    location: 'Los Angeles, CA',
    shelter: 'Feline Friends Foundation',
    shelterId: 's2',
    shelterVerified: true,
    images: ['https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=800'],
    description: 'Luna is a beautiful and vocal Siamese cat who loves attention and cuddles. She\'s very social and enjoys being around people.',
    healthStatus: 'Fully vaccinated, spayed, FIV/FeLV negative',
    behaviorNotes: 'Indoor cat, litter trained, affectionate, talkative',
    specialNeeds: false,
    featured: true
  },
  {
    id: '3',
    name: 'Max',
    species: 'Dog',
    breed: 'Labrador Mix',
    age: '5 years',
    ageCategory: 'Adult',
    size: 'Large',
    gender: 'Male',
    location: 'San Diego, CA',
    shelter: 'Second Chance Dogs',
    shelterId: 's3',
    shelterVerified: true,
    images: ['https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800'],
    description: 'Max is a loyal and calm Labrador mix looking for a forever home. He\'s great on walks and loves to relax at home.',
    healthStatus: 'Vaccinated, neutered, heartworm negative',
    behaviorNotes: 'Calm temperament, leash trained, good with older kids',
    specialNeeds: false,
    featured: true
  },
  {
    id: '4',
    name: 'Bella',
    species: 'Cat',
    breed: 'Domestic Shorthair',
    age: '3 years',
    ageCategory: 'Adult',
    size: 'Small',
    gender: 'Female',
    location: 'Oakland, CA',
    shelter: 'Bay Area Cat Rescue',
    shelterId: 's4',
    shelterVerified: true,
    images: ['https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800'],
    description: 'Bella is a sweet and independent cat who enjoys quiet time and gentle pets. Perfect for a calm household.',
    healthStatus: 'Vaccinated, spayed, healthy',
    behaviorNotes: 'Independent, calm, prefers quiet environments',
    specialNeeds: false,
    featured: true
  },
  {
    id: '5',
    name: 'Rocky',
    species: 'Dog',
    breed: 'German Shepherd',
    age: '4 years',
    ageCategory: 'Adult',
    size: 'Large',
    gender: 'Male',
    location: 'Sacramento, CA',
    shelter: 'Shepherd Sanctuary',
    shelterId: 's5',
    shelterVerified: true,
    images: ['https://images.unsplash.com/photo-1568572933382-74d440642117?w=800'],
    description: 'Rocky is an intelligent and protective German Shepherd. He needs an experienced owner and a secure yard.',
    healthStatus: 'Fully vaccinated, neutered, chip registered',
    behaviorNotes: 'Needs experienced handler, protective, loyal, active',
    specialNeeds: true,
    featured: false
  },
  {
    id: '6',
    name: 'Mittens',
    species: 'Cat',
    breed: 'Maine Coon',
    age: '6 months',
    ageCategory: 'Puppy/Kitten',
    size: 'Medium',
    gender: 'Female',
    location: 'San Jose, CA',
    shelter: 'Kitten Kingdom',
    shelterId: 's6',
    shelterVerified: true,
    images: ['https://images.unsplash.com/photo-1615789591457-74a63395c990?w=800'],
    description: 'Mittens is a playful Maine Coon kitten with a fluffy coat and sweet personality. She loves toys and treats.',
    healthStatus: 'Age-appropriate vaccines, scheduled spay',
    behaviorNotes: 'Playful, energetic, socialized with other cats',
    specialNeeds: false,
    featured: true
  },
  {
    id: '7',
    name: 'Duke',
    species: 'Dog',
    breed: 'Beagle',
    age: '3 years',
    ageCategory: 'Adult',
    size: 'Medium',
    gender: 'Male',
    location: 'Fresno, CA',
    shelter: 'Hound Haven',
    shelterId: 's7',
    shelterVerified: true,
    images: ['https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=800'],
    description: 'Duke is a friendly Beagle with a great nose and lots of energy. He loves sniffing adventures and treats.',
    healthStatus: 'Vaccinated, neutered, microchipped',
    behaviorNotes: 'Food motivated, good on leash, social with dogs',
    specialNeeds: false,
    featured: false
  },
  {
    id: '8',
    name: 'Whiskers',
    species: 'Cat',
    breed: 'Tabby',
    age: '8 years',
    ageCategory: 'Senior',
    size: 'Small',
    gender: 'Male',
    location: 'Berkeley, CA',
    shelter: 'Senior Cats Society',
    shelterId: 's8',
    shelterVerified: true,
    images: ['https://images.unsplash.com/photo-1529257414772-1960b7bea4eb?w=800'],
    description: 'Whiskers is a gentle senior cat looking for a quiet retirement home. He loves naps and gentle pets.',
    healthStatus: 'Senior wellness check complete, dental cleaning done',
    behaviorNotes: 'Calm, quiet, prefers peaceful environment, lap cat',
    specialNeeds: true,
    featured: false
  },
  {
    id: '9',
    name: 'Daisy',
    species: 'Dog',
    breed: 'French Bulldog',
    age: '2 years',
    ageCategory: 'Young',
    size: 'Small',
    gender: 'Female',
    location: 'Palo Alto, CA',
    shelter: 'Small Breed Rescue',
    shelterId: 's9',
    shelterVerified: true,
    images: ['https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800'],
    description: 'Daisy is an adorable French Bulldog with a playful personality. She loves cuddles and short walks.',
    healthStatus: 'Vaccinated, spayed, healthy',
    behaviorNotes: 'Apartment friendly, low energy, affectionate',
    specialNeeds: false,
    featured: true
  },
  {
    id: '10',
    name: 'Shadow',
    species: 'Cat',
    breed: 'Black Domestic Shorthair',
    age: '4 years',
    ageCategory: 'Adult',
    size: 'Medium',
    gender: 'Male',
    location: 'Santa Clara, CA',
    shelter: 'Black Cat Coalition',
    shelterId: 's10',
    shelterVerified: true,
    images: ['https://images.unsplash.com/photo-1529778873920-4da4926a72c2?w=800'],
    description: 'Shadow is a sleek black cat with golden eyes. He\'s calm and loving, perfect for any home.',
    healthStatus: 'Vaccinated, neutered, microchipped',
    behaviorNotes: 'Calm, affectionate, good with other pets',
    specialNeeds: false,
    featured: false
  },
  {
    id: '11',
    name: 'Buddy',
    species: 'Dog',
    breed: 'Corgi',
    age: '1 year',
    ageCategory: 'Young',
    size: 'Medium',
    gender: 'Male',
    location: 'Sunnyvale, CA',
    shelter: 'Corgi Connection',
    shelterId: 's11',
    shelterVerified: true,
    images: ['https://images.unsplash.com/photo-1597633425046-08f5110420f5?w=800'],
    description: 'Buddy is an energetic Corgi with short legs and a big personality. He loves to play and make friends.',
    healthStatus: 'Fully vaccinated, neutered, healthy',
    behaviorNotes: 'Energetic, playful, smart, needs training',
    specialNeeds: false,
    featured: true
  },
  {
    id: '12',
    name: 'Cleo',
    species: 'Cat',
    breed: 'Persian',
    age: '5 years',
    ageCategory: 'Adult',
    size: 'Small',
    gender: 'Female',
    location: 'Mountain View, CA',
    shelter: 'Luxe Pet Rescue',
    shelterId: 's12',
    shelterVerified: true,
    images: ['https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=800'],
    description: 'Cleo is an elegant Persian cat with a luxurious coat. She needs daily grooming and a calm home.',
    healthStatus: 'Vaccinated, spayed, grooming routine established',
    behaviorNotes: 'Calm, needs grooming, indoor only, quiet',
    specialNeeds: true,
    featured: false
  }
]

// Mock shelter data
const mockShelters: Shelter[] = [
  {
    id: 's1',
    name: 'Happy Paws Rescue',
    location: '123 Market St, San Francisco, CA 94102',
    city: 'San Francisco',
    state: 'CA',
    distance: 2.3,
    verified: true,
    phone: '(415) 555-0101',
    email: 'info@happypawsrescue.org',
    website: 'www.happypawsrescue.org',
    description: 'Dedicated to rescuing and rehoming dogs and puppies in the Bay Area. We focus on providing comprehensive care and finding perfect matches.',
    animalsAvailable: mockAnimals.filter(a => a.shelterId === 's1').length,
    image: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800',
    operatingHours: 'Mon-Sat: 10am-6pm, Sun: 12pm-5pm',
    specialties: ['Dogs', 'Puppies', 'Training Programs']
  },
  {
    id: 's2',
    name: 'Feline Friends Foundation',
    location: '456 Sunset Blvd, Los Angeles, CA 90028',
    city: 'Los Angeles',
    state: 'CA',
    distance: 5.8,
    verified: true,
    phone: '(310) 555-0202',
    email: 'contact@felinefriends.org',
    website: 'www.felinefriends.org',
    description: 'Leading cat rescue specializing in Siamese and exotic breeds. We provide medical care, spay/neuter services, and lifetime support.',
    animalsAvailable: mockAnimals.filter(a => a.shelterId === 's2').length,
    image: 'https://images.unsplash.com/photo-1415369629372-26f2fe60c467?w=800',
    operatingHours: 'Tue-Sun: 11am-7pm, Closed Mon',
    specialties: ['Cats', 'Exotic Breeds', 'FIV/FeLV Testing']
  },
  {
    id: 's3',
    name: 'Second Chance Dogs',
    location: '789 Ocean View Dr, San Diego, CA 92101',
    city: 'San Diego',
    state: 'CA',
    distance: 8.2,
    verified: true,
    phone: '(619) 555-0303',
    email: 'help@secondchancedogs.org',
    website: 'www.secondchancedogs.org',
    description: 'Giving adult dogs a second chance at happiness. We specialize in behavioral rehabilitation and senior dog care.',
    animalsAvailable: mockAnimals.filter(a => a.shelterId === 's3').length,
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800',
    operatingHours: 'Mon-Fri: 9am-5pm, Sat-Sun: 10am-4pm',
    specialties: ['Adult Dogs', 'Senior Care', 'Behavioral Training']
  },
  {
    id: 's4',
    name: 'Bay Area Cat Rescue',
    location: '321 Telegraph Ave, Oakland, CA 94612',
    city: 'Oakland',
    state: 'CA',
    distance: 3.1,
    verified: true,
    phone: '(510) 555-0404',
    email: 'rescue@bayareacats.org',
    website: 'www.bayareacats.org',
    description: 'Community-focused cat rescue serving Oakland and surrounding areas. We prioritize TNR programs and indoor cat adoption.',
    animalsAvailable: mockAnimals.filter(a => a.shelterId === 's4').length,
    image: 'https://images.unsplash.com/photo-1573865526739-10c1d3a1f0cc?w=800',
    operatingHours: 'Wed-Sun: 12pm-6pm, Closed Mon-Tue',
    specialties: ['Cats', 'TNR Programs', 'Community Outreach']
  },
  {
    id: 's5',
    name: 'Shepherd Sanctuary',
    location: '555 Capitol Mall, Sacramento, CA 95814',
    city: 'Sacramento',
    state: 'CA',
    distance: 12.5,
    verified: true,
    phone: '(916) 555-0505',
    email: 'info@shepherdsanctuary.org',
    website: 'www.shepherdsanctuary.org',
    description: 'Breed-specific rescue focused on German Shepherds and working dogs. We provide specialized training and experienced handler matching.',
    animalsAvailable: mockAnimals.filter(a => a.shelterId === 's5').length,
    image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=800',
    operatingHours: 'Sat-Sun: 10am-4pm, Weekday appointments available',
    specialties: ['German Shepherds', 'Working Dogs', 'Advanced Training']
  },
  {
    id: 's6',
    name: 'Kitten Kingdom',
    location: '999 Park Ave, San Jose, CA 95113',
    city: 'San Jose',
    state: 'CA',
    distance: 4.7,
    verified: true,
    phone: '(408) 555-0606',
    email: 'adopt@kittenkingdom.org',
    website: 'www.kittenkingdom.org',
    description: 'Kitten and young cat rescue with a focus on socialization and health. We offer adoption packages with starter supplies.',
    animalsAvailable: mockAnimals.filter(a => a.shelterId === 's6').length,
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800',
    operatingHours: 'Daily: 10am-8pm',
    specialties: ['Kittens', 'Young Cats', 'Adoption Packages']
  },
  {
    id: 's7',
    name: 'Hound Haven',
    location: '777 Shaw Ave, Fresno, CA 93710',
    city: 'Fresno',
    state: 'CA',
    distance: 18.9,
    verified: true,
    phone: '(559) 555-0707',
    email: 'contact@houndhaven.org',
    website: 'www.houndhaven.org',
    description: 'Specializing in hound breeds including Beagles, Bassets, and Bloodhounds. We emphasize scent work and mental stimulation.',
    animalsAvailable: mockAnimals.filter(a => a.shelterId === 's7').length,
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800',
    operatingHours: 'Thu-Mon: 11am-5pm, Closed Tue-Wed',
    specialties: ['Hound Breeds', 'Scent Training', 'Exercise Programs']
  },
  {
    id: 's8',
    name: 'Senior Cats Society',
    location: '2020 University Ave, Berkeley, CA 94704',
    city: 'Berkeley',
    state: 'CA',
    distance: 3.5,
    verified: true,
    phone: '(510) 555-0808',
    email: 'care@seniorcats.org',
    website: 'www.seniorcats.org',
    description: 'Dedicated exclusively to senior cats (7+ years). We provide medical care, dental services, and lifetime support programs.',
    animalsAvailable: mockAnimals.filter(a => a.shelterId === 's8').length,
    image: 'https://images.unsplash.com/photo-1573865526739-10c1d3a1f0cc?w=800',
    operatingHours: 'Mon-Sat: 10am-5pm, Closed Sun',
    specialties: ['Senior Cats', 'Medical Care', 'Hospice Foster']
  },
  {
    id: 's9',
    name: 'Small Breed Rescue',
    location: '1500 El Camino Real, Palo Alto, CA 94306',
    city: 'Palo Alto',
    state: 'CA',
    distance: 6.2,
    verified: true,
    phone: '(650) 555-0909',
    email: 'info@smallbreedrescue.org',
    website: 'www.smallbreedrescue.org',
    description: 'Focused on small dog breeds perfect for apartments and urban living. We specialize in French Bulldogs, Pugs, and toy breeds.',
    animalsAvailable: mockAnimals.filter(a => a.shelterId === 's9').length,
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800',
    operatingHours: 'Tue-Sat: 12pm-7pm, Sun: 12pm-5pm, Closed Mon',
    specialties: ['Small Breeds', 'Apartment Dogs', 'Urban Living']
  },
  {
    id: 's10',
    name: 'Black Cat Coalition',
    location: '3100 Mission Blvd, Santa Clara, CA 95050',
    city: 'Santa Clara',
    state: 'CA',
    distance: 5.0,
    verified: true,
    phone: '(408) 555-1010',
    email: 'adopt@blackcatcoalition.org',
    website: 'www.blackcatcoalition.org',
    description: 'Breaking stereotypes and finding homes for black cats. We focus on education and celebrating these beautiful felines.',
    animalsAvailable: mockAnimals.filter(a => a.shelterId === 's10').length,
    image: 'https://images.unsplash.com/photo-1529778873920-4da4926a72c2?w=800',
    operatingHours: 'Wed-Sun: 11am-6pm, Closed Mon-Tue',
    specialties: ['Black Cats', 'Education Programs', 'Community Events']
  },
  {
    id: 's11',
    name: 'Corgi Connection',
    location: '888 Mathilda Ave, Sunnyvale, CA 94085',
    city: 'Sunnyvale',
    state: 'CA',
    distance: 4.3,
    verified: true,
    phone: '(408) 555-1111',
    email: 'hello@corgiconnection.org',
    website: 'www.corgiconnection.org',
    description: 'Breed-specific rescue for Corgis and Corgi mixes. We provide training resources and connect with the local Corgi community.',
    animalsAvailable: mockAnimals.filter(a => a.shelterId === 's11').length,
    image: 'https://images.unsplash.com/photo-1597633425046-08f5110420f5?w=800',
    operatingHours: 'Sat-Sun: 10am-6pm, Weekday visits by appointment',
    specialties: ['Corgis', 'Training Classes', 'Breed Community']
  },
  {
    id: 's12',
    name: 'Luxe Pet Rescue',
    location: '2500 W El Camino Real, Mountain View, CA 94040',
    city: 'Mountain View',
    state: 'CA',
    distance: 7.1,
    verified: true,
    phone: '(650) 555-1212',
    email: 'contact@luxepetrescue.org',
    website: 'www.luxepetrescue.org',
    description: 'Specializing in purebred and high-maintenance breeds requiring special care. We provide grooming education and ongoing support.',
    animalsAvailable: mockAnimals.filter(a => a.shelterId === 's12').length,
    image: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=800',
    operatingHours: 'Mon-Sat: 10am-7pm, Sun: 11am-5pm',
    specialties: ['Purebreds', 'Grooming Education', 'High-Maintenance Breeds']
  }
]

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<'home' | 'browse' | 'shelters' | 'profile' | 'chat'>('home')
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null)
  const [selectedShelter, setSelectedShelter] = useState<Shelter | null>(null)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [userLocation, setUserLocation] = useState('San Francisco, CA')
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Perfect Companion</h1>
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
                        <div className="text-sm font-bold text-[#FF6B6B]">{shelter.distance} mi</div>
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
                <div className="text-[#FF6B6B] font-medium">{shelter.distance} miles from you</div>
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
                    <Input placeholder="Enter your city" defaultValue="San Francisco, CA" />
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
