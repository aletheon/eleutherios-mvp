// src/app/forums/create/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboard } from '@/contexts/DashboardContext';
import { doc, setDoc, collection, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Navigation from '@/components/Navigation';

interface Service {
  id: string;
  serviceName?: string;
  title?: string;
  description: string;
  provider: string;
  category?: string;
}

interface ForumForm {
  title: string;
  description: string;
  tags: string[];
  selectedServices: Service[];
}

export default function CreateForumPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { notifyForumCreated } = useDashboard();
  const [formData, setFormData] = useState<ForumForm>({
    title: '',
    description: '',
    tags: [],
    selectedServices: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [tagInput, setTagInput] = useState('');
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [serviceSearchTerm, setServiceSearchTerm] = useState('');
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);

  // Fetch services on component mount
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const servicesRef = collection(db, 'services');
        const q = query(servicesRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);

        const fetchedServices = querySnapshot.docs.map(doc => ({
          id: doc.id,
          serviceName: doc.data().serviceName,
          title: doc.data().title,
          description: doc.data().description,
          provider: doc.data().provider,
          category: doc.data().category
        })) as Service[];

        setServices(fetchedServices);
        setFilteredServices(fetchedServices);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchServices();
  }, []);

  // Filter services based on search term
  useEffect(() => {
    if (serviceSearchTerm.trim() === '') {
      setFilteredServices(services);
    } else {
      const filtered = services.filter(service => {
        const serviceName = service.serviceName || service.title || '';
        const searchLower = serviceSearchTerm.toLowerCase();
        return serviceName.toLowerCase().includes(searchLower) ||
               service.description.toLowerCase().includes(searchLower) ||
               service.provider.toLowerCase().includes(searchLower);
      });
      setFilteredServices(filtered);
    }
  }, [serviceSearchTerm, services]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()]
        }));
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleAddService = (service: Service) => {
    if (!formData.selectedServices.find(s => s.id === service.id)) {
      setFormData(prev => ({
        ...prev,
        selectedServices: [...prev.selectedServices, service]
      }));
    }
    setServiceSearchTerm('');
    setShowServiceDropdown(false);
  };

  const handleRemoveService = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedServices: prev.selectedServices.filter(s => s.id !== serviceId)
    }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.title || formData.title.trim().length < 3) {
      errors.title = 'Title must be at least 3 characters';
    }

    if (!formData.description || formData.description.trim().length < 10) {
      errors.description = 'Description must be at least 10 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    if (!user) {
      setError('You must be logged in to create a forum');
      return;
    }

    try {
      setLoading(true);

      // Create forum
      const forumId = `forum-${Date.now()}`;

      // Build participants list from creator and selected services
      const participants = [
        {
          userId: user.uid,
          name: user.profile?.name || 'Unknown User',
          role: user.profile?.role || 'user',
          permissions: ['create', 'invite', 'moderate', 'post'],
          joinedAt: new Date().toISOString()
        },
        ...formData.selectedServices.map(service => ({
          userId: service.id,
          name: service.serviceName || service.title || 'Unknown Service',
          role: 'service',
          permissions: ['view', 'post'],
          joinedAt: new Date().toISOString()
        }))
      ];

      const forum = {
        id: forumId,
        title: formData.title,
        description: formData.description,
        tags: formData.tags,
        created_by: user.uid,
        createdByName: user.profile?.name || 'Unknown User',
        createdByRole: user.profile?.role || 'user',
        participants,
        serviceMembers: formData.selectedServices.map(s => ({
          id: s.id,
          name: s.serviceName || s.title,
          provider: s.provider
        })),
        status: 'active',
        rules: [],
        messages: [],
        created_at: Timestamp.now(),
        updated_at: Timestamp.now()
      };

      const forumRef = doc(db, 'forums', forumId);
      await setDoc(forumRef, forum);

      console.log('✓ Created forum:', forumId);

      // Create notifications for forum creator and members
      const serviceMemberIds = formData.selectedServices.map(s => s.id);
      await notifyForumCreated(forumId, formData.title, user.uid, serviceMemberIds);

      // Redirect to forum page
      router.push(`/forums/${forumId}`);
    } catch (err: any) {
      console.error('Forum creation error:', err);
      setError(err.message || 'Failed to create forum');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8 ml-16 pt-16">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Create Forum
          </h1>
          <p className="mt-2 text-gray-600">
            Create a new coordination space for collaboration
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Forum Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Forum Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleInputChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  validationErrors.title ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="e.g., Project Coordination Forum"
              />
              {validationErrors.title && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  validationErrors.description ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Describe the purpose of this forum..."
              />
              {validationErrors.description && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.description}</p>
              )}
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                Tags
              </label>
              <input
                id="tags"
                name="tags"
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Type a tag and press Enter"
              />
              <p className="mt-1 text-xs text-gray-500">
                Press Enter to add tags
              </p>
              {formData.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Service Selection */}
            <div>
              <label htmlFor="serviceSearch" className="block text-sm font-medium text-gray-700">
                Add Services as Members
              </label>
              <div className="relative">
                <input
                  id="serviceSearch"
                  type="text"
                  value={serviceSearchTerm}
                  onChange={(e) => {
                    setServiceSearchTerm(e.target.value);
                    setShowServiceDropdown(true);
                  }}
                  onFocus={() => setShowServiceDropdown(true)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search for services..."
                />

                {/* Service Dropdown */}
                {showServiceDropdown && filteredServices.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm border border-gray-300">
                    {filteredServices.slice(0, 10).map((service) => (
                      <div
                        key={service.id}
                        onClick={() => handleAddService(service)}
                        className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-blue-50"
                      >
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">
                            {service.serviceName || service.title}
                          </span>
                          <span className="text-sm text-gray-500 truncate">
                            {service.provider} • {service.description?.substring(0, 60)}...
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Search and select services to add as forum members
              </p>

              {/* Selected Services */}
              {formData.selectedServices.length > 0 && (
                <div className="mt-3 space-y-2">
                  <p className="text-sm font-medium text-gray-700">Selected Services:</p>
                  {formData.selectedServices.map((service) => (
                    <div
                      key={service.id}
                      className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {service.serviceName || service.title}
                        </p>
                        <p className="text-xs text-gray-500">{service.provider}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveService(service.id)}
                        className="ml-2 text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <p className="text-sm text-blue-800">
                <strong>✓ This forum will include:</strong>
              </p>
              <ul className="mt-2 text-xs text-blue-700 space-y-1 ml-4">
                <li>• You as the forum creator with full moderation permissions</li>
                <li>• Selected services as forum members with participation permissions</li>
                <li>• Real-time messaging and collaboration features</li>
                <li>• Ability to add custom rules and governance policies</li>
                <li>• Options to invite additional members and services</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4">
              <Link
                href="/forums"
                className="text-gray-600 hover:text-gray-900 font-medium text-sm"
              >
                ← Back to Forums
              </Link>

              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
              >
                {loading ? 'Creating Forum...' : 'Create Forum'}
              </button>
            </div>
          </form>
        </div>

        {/* Next Steps Info */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Next Steps After Creation</h3>
          <ol className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start">
              <span className="font-bold text-blue-600 mr-2">1.</span>
              <span>Forum will be created with you and your selected services as initial members</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold text-blue-600 mr-2">2.</span>
              <span>Use EleuScript rules to define governance and add policies as needed</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold text-blue-600 mr-2">3.</span>
              <span>Collaborate through real-time messaging and coordinate service activation</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold text-blue-600 mr-2">4.</span>
              <span>Invite additional members and configure permissions based on your needs</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
    </>
  );
}
