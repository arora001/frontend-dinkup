'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { getSocket } from '@/lib/socket';
import { Venue, TricityCity } from '@/types';
import {
  Flame,
  MapPin,
  Calendar,
  Sparkles,
  Wifi,
  WifiOff,
  PlusCircle,
  LogIn,
  Sun,
  Shield,
  Phone,
  MessageCircle,
} from 'lucide-react';

const CITIES: { id: TricityCity | 'ALL'; label: string }[] = [
  { id: 'ALL', label: 'All Tricity' },
  { id: TricityCity.CHANDIGARH, label: 'Chandigarh' },
  { id: TricityCity.MOHALI, label: 'Mohali' },
  { id: TricityCity.PANCHKULA, label: 'Panchkula' },
  { id: TricityCity.ZIRAKPUR, label: 'Zirakpur' },
];

export default function HomePage() {
  const [selectedCity, setSelectedCity] = useState<TricityCity | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSocketConnected, setIsSocketConnected] = useState(false);

  useEffect(() => {
    const socket = getSocket();
    setIsSocketConnected(socket.connected);

    const onConnect = () => setIsSocketConnected(true);
    const onDisconnect = () => setIsSocketConnected(false);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  const {
    data: venues = [],
    isLoading,
    isError,
    error,
  } = useQuery<Venue[]>({
    queryKey: ['venues', selectedCity],
    queryFn: () => {
      const url =
        selectedCity === 'ALL'
          ? 'venues'
          : `venues?city=${encodeURIComponent(selectedCity)}`;
      return apiClient<Venue[]>(url);
    },
  });

  const filteredVenues = venues.filter((venue) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      venue.name.toLowerCase().includes(q) ||
      venue.area.toLowerCase().includes(q) ||
      venue.city.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-canvas-base flex flex-col text-text-primary selection:bg-brand-volt selection:text-black">
      {/* Top Notification Bar / Realtime indicator */}
      <div className="border-b border-border-subtle/60 bg-surface-card/40 backdrop-blur-md px-4 py-2 text-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isSocketConnected ? 'bg-status-avail-text' : 'bg-status-held-text'
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                isSocketConnected ? 'bg-status-avail-text' : 'bg-status-held-text'
              }`}
            />
          </span>
          <span className="text-text-secondary">
            {isSocketConnected ? (
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <Wifi className="w-3.5 h-3.5" /> Live Availability Connected
              </span>
            ) : (
              <span className="flex items-center gap-1 text-amber-400">
                <WifiOff className="w-3.5 h-3.5" /> Realtime Connecting...
              </span>
            )}
          </span>
        </div>
        <div className="text-text-muted hidden sm:inline">
          Backend API: <code className="text-text-secondary">localhost:5003</code>
        </div>
      </div>

      {/* Main Navigation */}
      <header className="sticky top-0 z-40 backdrop-blur-lg bg-canvas-base/80 border-b border-border-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-9 w-9 rounded-xl bg-brand-volt text-black flex items-center justify-center font-black text-xl shadow-[0_0_20px_rgba(212,255,0,0.4)] transition-transform group-hover:scale-105">
              ⚡
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-text-primary">
                Dink<span className="text-brand-volt">Up</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs uppercase tracking-wider text-text-muted font-bold">
                Tricity
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/host/dashboard"
              className="px-3 py-1.5 rounded-lg border border-border-subtle hover:border-brand-volt/50 text-text-secondary hover:text-text-primary text-sm font-medium transition-colors flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4 text-brand-volt" />
              <span>Host Portal</span>
            </Link>

            <Link
              href="/auth/login"
              className="px-4 py-1.5 rounded-lg bg-brand-volt text-black font-semibold text-sm hover:bg-brand-volt-hover transition-colors shadow-sm flex items-center gap-1.5"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <section className="relative rounded-3xl bg-gradient-to-br from-surface-card via-surface-card to-surface-elevated border border-border-subtle p-6 sm:p-10 overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-volt/10 border border-brand-volt/30 text-brand-volt text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Chandigarh • Mohali • Panchkula • Zirakpur
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-text-primary leading-tight">
              Book a court. Join a game. <br />
              <span className="text-brand-volt">Zero double-bookings.</span>
            </h1>
            <p className="text-text-secondary text-sm sm:text-base leading-relaxed">
              Every slot lock is backed by atomic PostgreSQL row updates. Holds
              last 5 minutes while you checkout, with instant live availability
              streamed straight to your screen.
            </p>

            {/* Instant Search Bar */}
            <div className="pt-2">
              <div className="relative max-w-md">
                <input
                  type="text"
                  placeholder="Search sector, area, or venue name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-canvas-base/90 border border-border-subtle rounded-xl px-4 py-3 pl-10 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-volt focus:ring-1 focus:ring-brand-volt"
                />
                <MapPin className="w-4 h-4 text-text-muted absolute left-3.5 top-3.5" />
              </div>
            </div>
          </div>
        </section>

        {/* City Filter Strip */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
              <Flame className="w-5 h-5 text-brand-volt" />
              Pickleball Venues in Tricity
            </h2>
            <span className="text-xs text-text-muted">
              {filteredVenues.length} {filteredVenues.length === 1 ? 'venue' : 'venues'} found
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CITIES.map((city) => {
              const isActive = selectedCity === city.id;
              return (
                <button
                  key={city.id}
                  onClick={() => setSelectedCity(city.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-brand-volt text-black shadow-md shadow-brand-volt/20 scale-[1.02]'
                      : 'bg-surface-card border border-border-subtle text-text-secondary hover:text-text-primary hover:border-brand-volt/40'
                  }`}
                >
                  {city.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* Venue Directory Grid */}
        <section>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="rounded-2xl border border-border-subtle bg-surface-card p-5 space-y-4 animate-pulse"
                >
                  <div className="h-44 rounded-xl bg-surface-elevated" />
                  <div className="h-5 w-2/3 bg-surface-elevated rounded" />
                  <div className="h-4 w-1/2 bg-surface-elevated rounded" />
                  <div className="h-10 bg-surface-elevated rounded-xl" />
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="rounded-2xl border border-status-block-text/40 bg-status-block-bg p-8 text-center space-y-3">
              <p className="text-status-block-text font-semibold">
                Unable to load venues from the backend
              </p>
              <p className="text-xs text-text-secondary">
                {(error as Error)?.message || 'Make sure the NestJS backend is running at http://localhost:5003'}
              </p>
            </div>
          ) : filteredVenues.length === 0 ? (
            <div className="rounded-2xl border border-border-subtle bg-surface-card/60 p-12 text-center space-y-4">
              <div className="inline-flex p-4 rounded-2xl bg-surface-elevated text-brand-volt">
                <MapPin className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-text-primary">
                No venues found
              </h3>
              <p className="text-text-secondary text-sm max-w-md mx-auto">
                No pickleball facilities are registered yet in this area. You can
                use the Host Portal to create and publish a new venue!
              </p>
              <div className="pt-2">
                <Link
                  href="/host/venues/new"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-volt text-black font-semibold text-sm hover:bg-brand-volt-hover transition-colors"
                >
                  <PlusCircle className="w-4 h-4" />
                  Create First Venue
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVenues.map((venue) => {
                const coverImage =
                  venue.images?.find((img) => img.isCover)?.url ||
                  venue.images?.[0]?.url;

                const minPrice = venue.courts?.length
                  ? Math.min(...venue.courts.map((c) => c.basePricePerHour))
                  : null;

                return (
                  <div
                    key={venue.id}
                    className="group rounded-2xl border border-border-subtle bg-surface-card hover:border-brand-volt/40 transition-all duration-300 flex flex-col overflow-hidden shadow-lg hover:shadow-2xl"
                  >
                    {/* Cover Image / Placeholder */}
                    <div className="relative h-48 bg-surface-elevated overflow-hidden">
                      {coverImage ? (
                        <img
                          src={coverImage}
                          alt={venue.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-text-muted bg-gradient-to-t from-surface-elevated to-surface-card p-4 text-center">
                          <span className="text-3xl mb-1">🏓</span>
                          <span className="text-xs font-medium">
                            Pickleball Court
                          </span>
                        </div>
                      )}

                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[11px] font-bold text-text-primary border border-white/10 uppercase tracking-wider">
                        📍 {venue.city}
                      </div>

                      {minPrice !== null && (
                        <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-surface-card/90 backdrop-blur-md text-xs font-bold text-brand-volt border border-border-subtle">
                          From ₹{minPrice} / hr
                        </div>
                      )}
                    </div>

                    {/* Venue Body */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <h3 className="text-lg font-bold text-text-primary group-hover:text-brand-volt transition-colors line-clamp-1">
                          {venue.name}
                        </h3>
                        <p className="text-xs text-text-secondary mt-1 flex items-center gap-1 line-clamp-1">
                          <MapPin className="w-3.5 h-3.5 text-accent-cyan shrink-0" />
                          {venue.area}, {venue.address}
                        </p>
                      </div>

                      {/* Amenities pills */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {venue.hasLighting && (
                          <span className="px-2 py-0.5 rounded-md bg-surface-elevated text-[11px] text-text-secondary border border-border-subtle">
                            💡 Floodlights
                          </span>
                        )}
                        {venue.hasEquipmentRental && (
                          <span className="px-2 py-0.5 rounded-md bg-surface-elevated text-[11px] text-text-secondary border border-border-subtle">
                            🏓 Paddle Rentals
                          </span>
                        )}
                        {venue.hasParking && (
                          <span className="px-2 py-0.5 rounded-md bg-surface-elevated text-[11px] text-text-secondary border border-border-subtle">
                            🚗 Parking
                          </span>
                        )}
                      </div>

                      {/* Courts count & Action */}
                      <div className="pt-2 border-t border-border-subtle/50 flex items-center justify-between">
                        <span className="text-xs text-text-muted">
                          {venue.courts?.length || 0}{' '}
                          {venue.courts?.length === 1 ? 'Court' : 'Courts'}
                        </span>

                        <Link
                          href={`/venues/${venue.slug}`}
                          className="px-3.5 py-1.5 rounded-lg bg-brand-volt text-black text-xs font-bold hover:bg-brand-volt-hover transition-colors inline-flex items-center gap-1"
                        >
                          View & Book ➔
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border-subtle bg-surface-card/30 mt-16 py-8 px-4 text-center text-xs text-text-muted space-y-2">
        <p className="font-semibold text-text-secondary">
          DinkUp — Dedicated Pickleball Court Platform for Chandigarh Tricity
        </p>
        <p>
          Next.js App Router • Tailwind CSS • TanStack Query • Socket.IO Client •
          NestJS Backend at localhost:5003
        </p>
      </footer>
    </div>
  );
}
