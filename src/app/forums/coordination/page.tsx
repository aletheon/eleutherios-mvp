'use client';

import React, { useState } from 'react';
import { Home, Heart, Utensils, Send, Paperclip, CheckCircle, Clock, User, FileText, DollarSign, Key, MapPin } from 'lucide-react';

export default function CoordinationForum() {
  const [selectedForum, setSelectedForum] = useState('housing');
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState<'person' | 'msd' | 'ko' | 'healthcare'>('person');

  const forums = [
    { id: 'housing', name: 'Emergency Housing', icon: Home, color: 'blue', unread: 3 },
    { id: 'healthcare', name: 'Healthcare Access', icon: Heart, color: 'red', unread: 1 },
    { id: 'food', name: 'Food Security', icon: Utensils, color: 'green', unread: 0 }
  ];

  const users = {
    person: { name: 'John Smith', role: 'Applicant', avatar: '👤', color: 'bg-purple-500' },
    msd: { name: 'Sarah Jones', role: 'MSD Case Worker', avatar: '👩‍💼', color: 'bg-blue-500' },
    ko: { name: 'Mike Wilson', role: 'KO Housing Officer', avatar: '👨‍💼', color: 'bg-green-500' },
    healthcare: { name: 'Dr. Anjali Patel', role: 'Healthcare Provider', avatar: '👩‍⚕️', color: 'bg-red-500' }
  };

  const housingMessages = [
    {
      id: 1,
      sender: 'person',
      content: "Hi, I'm currently experiencing homelessness and need urgent housing assistance. I've been sleeping rough for the past week and need help.",
      timestamp: '10:15 AM',
      date: 'Today'
    },
    {
      id: 2,
      sender: 'msd',
      content: "Hi John, I'm Sarah from MSD. I've received your emergency housing request through the PFSD system. I'm initiating your eligibility assessment right now. Can you tell me about your current situation?",
      timestamp: '10:18 AM',
      date: 'Today'
    },
    {
      id: 3,
      sender: 'person',
      content: "Thank you Sarah. I lost my rental accommodation last week due to financial difficulties. I have no family support in the area. I'm currently staying at a friend's place but can only stay for a few more days.",
      timestamp: '10:22 AM',
      date: 'Today'
    },
    {
      id: 4,
      sender: 'msd',
      content: "Thank you for that information. I've completed your eligibility assessment and you qualify for Emergency Housing Special Needs Grant. I'm approving this now.",
      timestamp: '10:25 AM',
      date: 'Today',
      status: 'approved',
      statusText: 'Financial Support Approved'
    },
    {
      id: 5,
      sender: 'ko',
      content: "Hi John, I'm Mike from Kāinga Ora. Sarah has looped me in. I can see you've been approved for emergency housing support. I have an emergency placement available in Christchurch Central. Would you like to schedule a viewing?",
      timestamp: '10:30 AM',
      date: 'Today'
    },
    {
      id: 6,
      sender: 'person',
      content: "Yes please! That would be amazing. When can I view it?",
      timestamp: '10:32 AM',
      date: 'Today'
    },
    {
      id: 7,
      sender: 'ko',
      content: "Great! I can arrange a viewing for tomorrow at 2 PM. The property is a 1-bedroom unit at 123 Manchester Street. It's fully furnished and available immediately. I'll send you the details and digital tenancy agreement.",
      timestamp: '10:35 AM',
      date: 'Today',
      attachments: [
        { name: 'Property_Details.pdf', icon: FileText },
        { name: 'Tenancy_Agreement.pdf', icon: FileText }
      ]
    }
  ];

  const healthcareMessages = [
    {
      id: 1,
      sender: 'person',
      content: "I need to register for healthcare services. I haven't seen a doctor in over a year and I'm having some health issues.",
      timestamp: '11:00 AM',
      date: 'Today'
    },
    {
      id: 2,
      sender: 'healthcare',
      content: "Hi John, I'm Dr. Patel. I've enrolled you in our emergency healthcare program. You now have free access to GP visits, prescriptions, and emergency dental care. Would you like to schedule an initial health assessment?",
      timestamp: '11:05 AM',
      date: 'Today',
      status: 'approved',
      statusText: 'Healthcare Enrollment Complete'
    },
    {
      id: 3,
      sender: 'person',
      content: "Yes please, that would be really helpful. I also need to see a dentist - I have a tooth that's been causing me pain.",
      timestamp: '11:08 AM',
      date: 'Today'
    },
    {
      id: 4,
      sender: 'healthcare',
      content: "I've booked you for a health assessment tomorrow at 10 AM at Christchurch Community Health Centre. I'm also referring you to our emergency dental clinic. They can see you this Friday at 2 PM.",
      timestamp: '11:12 AM',
      date: 'Today',
      attachments: [
        { name: 'Health_Assessment_Appointment.pdf', icon: FileText },
        { name: 'Dental_Referral.pdf', icon: FileText }
      ]
    }
  ];

  const foodMessages = [
    {
      id: 1,
      sender: 'person',
      content: "I need help with food. I haven't been eating regularly and need access to food support.",
      timestamp: '9:30 AM',
      date: 'Today'
    },
    {
      id: 2,
      sender: 'msd',
      content: "Hi John, I've registered you with our partner food banks in Christchurch. You can access food parcels weekly at the following locations. I'm also approving a $200 food grant that will be deposited into your account within 24 hours.",
      timestamp: '9:35 AM',
      date: 'Today',
      status: 'approved',
      statusText: '$200 Food Grant Approved',
      attachments: [
        { name: 'Food_Bank_Locations.pdf', icon: MapPin }
      ]
    }
  ];

  const getMessages = () => {
    switch(selectedForum) {
      case 'housing': return housingMessages;
      case 'healthcare': return healthcareMessages;
      case 'food': return foodMessages;
      default: return [];
    }
  };

  const serviceStatuses: any = {
    housing: [
      { label: 'Eligibility', status: 'approved', icon: CheckCircle },
      { label: 'Financial Support', status: 'approved', icon: DollarSign },
      { label: 'Housing Placement', status: 'pending', icon: Home },
      { label: 'Tenancy Agreement', status: 'pending', icon: FileText }
    ],
    healthcare: [
      { label: 'Healthcare Enrollment', status: 'approved', icon: CheckCircle },
      { label: 'GP Appointment', status: 'scheduled', icon: Clock },
      { label: 'Dental Appointment', status: 'scheduled', icon: Clock }
    ],
    food: [
      { label: 'Food Bank Registration', status: 'approved', icon: CheckCircle },
      { label: 'Food Grant', status: 'approved', icon: DollarSign }
    ]
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    setNewMessage('');
  };

  const currentForum = forums.find(f => f.id === selectedForum);
  const ForumIcon = currentForum?.icon || Home;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">My Forums</h1>
          <p className="text-sm text-gray-600 mt-1">Policy coordination spaces</p>
        </div>

        {/* User Switcher */}
        <div className="p-4 border-b border-gray-200 bg-yellow-50">
          <label className="text-xs font-semibold text-gray-700 block mb-2">
            DEMO: View as
          </label>
          <select
            value={currentUser}
            onChange={(e) => setCurrentUser(e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="person">John Smith (Person)</option>
            <option value="msd">Sarah Jones (MSD)</option>
            <option value="ko">Mike Wilson (KO)</option>
            <option value="healthcare">Dr. Patel (Healthcare)</option>
          </select>
        </div>

        <div className="flex-1 overflow-y-auto">
          {forums.map(forum => {
            const Icon = forum.icon;
            return (
              <button
                key={forum.id}
                onClick={() => setSelectedForum(forum.id)}
                className={`w-full p-4 flex items-center gap-4 hover:bg-gray-50 transition ${
                  selectedForum === forum.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                }`}
              >
                <div className={`w-12 h-12 rounded-full bg-${forum.color}-100 flex items-center justify-center`}>
                  <Icon className={`text-${forum.color}-600`} size={24} />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-gray-900">{forum.name}</h3>
                  <p className="text-sm text-gray-500">Active coordination</p>
                </div>
                {forum.unread > 0 && (
                  <div className="bg-blue-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {forum.unread}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full bg-${currentForum?.color}-100 flex items-center justify-center`}>
                <ForumIcon className={`text-${currentForum?.color}-600`} size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{currentForum?.name}</h2>
                <div className="flex items-center gap-4 mt-1">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {Object.entries(users).map(([key, user]) => (
                        <div
                          key={key}
                          className={`${user.color} w-8 h-8 rounded-full flex items-center justify-center text-white text-sm border-2 border-white`}
                          title={user.name}
                        >
                          {user.avatar}
                        </div>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">4 participants</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm text-gray-600">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Messages */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {getMessages().map((message: any) => {
                const sender = users[message.sender as keyof typeof users];
                const isCurrentUser = message.sender === currentUser;
                
                return (
                  <div
                    key={message.id}
                    className={`flex gap-4 ${isCurrentUser ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`${sender.color} w-10 h-10 rounded-full flex items-center justify-center text-white flex-shrink-0`}>
                      {sender.avatar}
                    </div>
                    <div className={`flex-1 max-w-2xl ${isCurrentUser ? 'items-end' : ''}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">{sender.name}</span>
                        <span className="text-xs text-gray-500">{sender.role}</span>
                        <span className="text-xs text-gray-400">{message.timestamp}</span>
                      </div>
                      <div className={`p-4 rounded-lg ${
                        isCurrentUser ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        
                        {message.status && (
                          <div className={`mt-3 pt-3 border-t ${isCurrentUser ? 'border-blue-500' : 'border-gray-200'}`}>
                            <div className="flex items-center gap-2">
                              <CheckCircle size={16} className={isCurrentUser ? 'text-white' : 'text-green-600'} />
                              <span className="font-semibold text-sm">{message.statusText}</span>
                            </div>
                          </div>
                        )}
                        
                        {message.attachments && (
                          <div className="mt-3 space-y-2">
                            {message.attachments.map((attachment: any, idx: number) => {
                              const Icon = attachment.icon;
                              return (
                                <div
                                  key={idx}
                                  className={`flex items-center gap-2 p-2 rounded ${
                                    isCurrentUser ? 'bg-blue-500' : 'bg-gray-50'
                                  }`}
                                >
                                  <Icon size={16} />
                                  <span className="text-sm font-medium">{attachment.name}</span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 p-4 bg-white">
              <div className="flex items-center gap-4">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                  <Paperclip size={20} className="text-gray-600" />
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
            <div className="p-6">
              <h3 className="font-bold text-gray-900 mb-4">Service Status</h3>
              <div className="space-y-3">
                {serviceStatuses[selectedForum]?.map((service: any, idx: number) => {
                  const Icon = service.icon;
                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-lg border-2 ${
                        service.status === 'approved'
                          ? 'border-green-200 bg-green-50'
                          : service.status === 'scheduled'
                          ? 'border-blue-200 bg-blue-50'
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          size={20}
                          className={
                            service.status === 'approved'
                              ? 'text-green-600'
                              : service.status === 'scheduled'
                              ? 'text-blue-600'
                              : 'text-gray-400'
                          }
                        />
                        <div className="flex-1">
                          <div className="font-medium text-sm text-gray-900">
                            {service.label}
                          </div>
                          <div
                            className={`text-xs mt-1 font-semibold ${
                              service.status === 'approved'
                                ? 'text-green-600'
                                : service.status === 'scheduled'
                                ? 'text-blue-600'
                                : 'text-gray-500'
                            }`}
                          >
                            {service.status === 'approved' && '✓ Approved'}
                            {service.status === 'scheduled' && '⏰ Scheduled'}
                            {service.status === 'pending' && '⏳ Pending'}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {selectedForum === 'housing' && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Next Steps</h4>
                  <ul className="text-sm text-blue-800 space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle size={16} className="flex-shrink-0 mt-0.5" />
                      <span>Attend property viewing tomorrow at 2 PM</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Clock size={16} className="flex-shrink-0 mt-0.5" />
                      <span>Review and sign tenancy agreement</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Key size={16} className="flex-shrink-0 mt-0.5" />
                      <span>Collect keys and move in</span>
                    </li>
                  </ul>
                </div>
              )}

              {selectedForum === 'healthcare' && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-semibold text-red-900 mb-2">Appointments</h4>
                  <ul className="text-sm text-red-800 space-y-2">
                    <li className="flex items-start gap-2">
                      <Clock size={16} className="flex-shrink-0 mt-0.5" />
                      <span>Health Assessment - Tomorrow 10 AM</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Clock size={16} className="flex-shrink-0 mt-0.5" />
                      <span>Dental Appointment - Friday 2 PM</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}