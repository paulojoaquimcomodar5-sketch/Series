/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Globe, Star, Play, Info, X, ChevronRight, Film, Tv } from 'lucide-react';
import { Language, Movie } from './types';
import { translations } from './translations';
import { movies } from './data/movies';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function App() {
  const [lang, setLang] = useState<Language>('pt');
  const [audioLang, setAudioLang] = useState<Language>('pt');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const t = translations[lang];

  const filteredMovies = useMemo(() => {
    return movies.filter((movie) => {
      const titleMatch = movie.title[lang].toLowerCase().includes(searchQuery.toLowerCase());
      const castMatch = movie.cast.some((actor) =>
        actor.toLowerCase().includes(searchQuery.toLowerCase())
      );
      const tabMatch = activeTab === 'all' || movie.category.toLowerCase() === activeTab.toLowerCase();
      return (titleMatch || castMatch) && tabMatch;
    });
  }, [lang, searchQuery, activeTab]);

  const featuredMovie = movies[0];

  return (
    <div className="min-h-screen bg-elegant-bg text-white pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-elegant-bg/80 backdrop-blur-md border-b border-white/10 px-4 md:px-10 py-4 flex items-center justify-between h-[70px]">
        <div className="flex items-center gap-2">
          <h1 className="text-xl md:text-2xl font-black tracking-[1px] md:tracking-[2px] text-white uppercase">
            COMODAR <span className="text-elegant-accent">SÉRIE</span> INC.
          </h1>
        </div>

        <div className="flex items-center gap-3 md:gap-6">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-elegant-muted w-4 h-4" />
            <input
              type="text"
              placeholder={t.search}
              className="bg-white/5 border border-white/10 rounded-md py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-elegant-accent w-64 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-1 md:gap-2">
            {(['pt', 'ny', 'en', 'es'] as Language[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-2 py-1 rounded text-[10px] md:text-[12px] font-bold transition-all ${
                  lang === l
                    ? 'text-elegant-accent border border-elegant-accent'
                    : 'text-elegant-muted hover:text-white'
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-10 mt-6 md:mt-8">
        {/* Hero Section */}
        {!searchQuery && activeTab === 'all' && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative min-h-[350px] md:h-[400px] rounded-xl overflow-hidden mb-8 md:mb-12 group border border-white/5 cinematic-gradient flex items-center"
          >
            <img
              src={featuredMovie.image}
              alt={featuredMovie.title[lang]}
              className="absolute right-0 top-0 w-full md:w-2/3 h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-40 md:opacity-60"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-elegant-bg via-elegant-bg/90 md:via-elegant-bg/80 to-transparent" />
            <div className="relative p-6 md:p-12 max-w-xl z-10">
              <div className="inline-block px-3 py-1 bg-elegant-accent/20 text-elegant-accent rounded-full text-[10px] md:text-[11px] font-bold uppercase mb-3 md:mb-4 w-fit">
                Legado Eterno
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold mb-3 md:mb-4 leading-tight md:leading-none text-white">
                {featuredMovie.title[lang]}
              </h2>
              <p className="text-elegant-muted text-xs md:text-sm leading-relaxed mb-6 md:mb-8 line-clamp-3 md:line-clamp-none">
                {featuredMovie.description[lang]}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <Button className="bg-elegant-accent text-white hover:bg-elegant-accent/90 rounded-md px-6 md:px-8 py-4 md:py-6 h-auto text-xs md:text-sm font-bold">
                  Assistir Agora
                </Button>
                <Button
                  variant="secondary"
                  className="rounded-md px-6 md:px-8 py-4 md:py-6 h-auto text-xs md:text-sm font-bold bg-white/10 hover:bg-white/20 backdrop-blur-sm border-none"
                  onClick={() => setSelectedMovie(featuredMovie)}
                >
                  Minha Lista
                </Button>
              </div>
            </div>
          </motion.section>
        )}

        {/* Section Title */}
        <div className="flex items-end justify-between mb-6 md:mb-8">
          <h2 className="text-sm md:text-lg font-bold uppercase tracking-[1px] md:tracking-[1.5px] text-white">
            {t.blackPantherCast}
          </h2>
          <a href="#" className="text-[10px] md:text-[12px] text-elegant-accent font-bold">Ver Todos</a>
        </div>

        {/* Categories & Filter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
            <TabsList className="bg-white/5 border border-white/10 p-1 h-auto rounded-md flex w-full md:w-auto">
              <TabsTrigger value="all" className="flex-1 md:flex-none rounded-md px-4 md:px-6 py-2 text-xs md:text-sm data-[state=active]:bg-elegant-accent data-[state=active]:text-white">
                {t.allMovies}
              </TabsTrigger>
              <TabsTrigger value="Action" className="flex-1 md:flex-none rounded-md px-4 md:px-6 py-2 text-xs md:text-sm data-[state=active]:bg-elegant-accent data-[state=active]:text-white">
                Action
              </TabsTrigger>
              <TabsTrigger value="Drama" className="flex-1 md:flex-none rounded-md px-4 md:px-6 py-2 text-xs md:text-sm data-[state=active]:bg-elegant-accent data-[state=active]:text-white">
                Drama
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Movie Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6">
          <AnimatePresence mode="popLayout">
            {filteredMovies.map((movie, index) => (
              <motion.div
                key={movie.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <Card
                  className="bg-elegant-card border border-white/5 movie-card-hover overflow-hidden cursor-pointer group h-full flex flex-col rounded-lg"
                  onClick={() => setSelectedMovie(movie)}
                >
                  <div className="relative h-[140px] overflow-hidden bg-[#222]">
                    <img
                      src={movie.image}
                      alt={movie.title[lang]}
                      className="w-full h-full object-cover opacity-60 transition-transform duration-500 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  </div>
                  <CardContent className="p-4 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-sm mb-2 line-clamp-1 group-hover:text-elegant-accent transition-colors">
                        {movie.title[lang]}
                      </h3>
                      <div className="flex items-center gap-3 text-[11px] text-elegant-muted">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-elegant-gold fill-current" />
                          <span>{movie.rating}</span>
                        </div>
                        <span>{movie.year}</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-elegant-accent uppercase font-bold mt-3 block">
                      {movie.cast[0]}
                    </span>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredMovies.length === 0 && (
          <div className="text-center py-20">
            <Film className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <p className="text-elegant-muted text-lg">Nenhum filme encontrado para sua busca.</p>
          </div>
        )}
      </main>

      {/* Movie Details Dialog */}
      <Dialog open={!!selectedMovie} onOpenChange={(open) => !open && setSelectedMovie(null)}>
        <DialogContent className="max-w-4xl bg-elegant-bg border-white/10 p-0 overflow-hidden rounded-xl w-[95vw] md:w-full">
          {selectedMovie && (
            <div className="flex flex-col md:flex-row h-full max-h-[90vh] overflow-y-auto md:overflow-hidden">
              <div className="w-full md:w-2/5 relative h-64 md:h-auto">
                <img
                  src={selectedMovie.image}
                  alt={selectedMovie.title[lang]}
                  className="w-full h-full object-cover opacity-70"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-elegant-bg md:bg-gradient-to-r md:from-transparent md:to-elegant-bg" />
              </div>
              <div className="w-full md:w-3/5 p-6 md:p-12 flex flex-col">
                <div className="flex items-center justify-between mb-4 md:mb-6">
                  <div className="px-3 py-1 bg-elegant-accent/20 text-elegant-accent rounded-full text-[10px] md:text-[11px] font-bold uppercase">
                    {selectedMovie.category}
                  </div>
                  <div className="flex items-center gap-2 text-elegant-gold">
                    <Star className="w-4 h-4 md:w-5 md:h-5 fill-current" />
                    <span className="font-bold text-base md:text-lg">{selectedMovie.rating}</span>
                  </div>
                </div>
                
                <h2 className="text-2xl md:text-4xl font-extrabold mb-2 leading-tight">{selectedMovie.title[lang]}</h2>
                <p className="text-elegant-accent mb-4 md:mb-6 font-bold text-sm md:text-base">{selectedMovie.year}</p>
                
                <ScrollArea className="flex-grow mb-6 md:mb-8 pr-4 max-h-[300px] md:max-h-none">
                  <p className="text-xs md:text-sm text-elegant-muted leading-relaxed mb-6 md:mb-8">
                    {selectedMovie.description[lang]}
                  </p>
                  
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <h4 className="text-[9px] md:text-[10px] uppercase tracking-widest text-white/40 font-bold">{t.audioLanguage}</h4>
                      <div className="flex flex-wrap gap-2">
                        {(['pt', 'ny', 'en', 'es'] as Language[]).map((l) => (
                          <button
                            key={l}
                            onClick={() => setAudioLang(l)}
                            className={`px-2.5 py-1.5 rounded-md text-[10px] md:text-xs font-bold transition-all border ${
                              audioLang === l
                                ? 'bg-elegant-accent border-elegant-accent text-white'
                                : 'bg-white/5 border-white/10 text-elegant-muted hover:text-white'
                            }`}
                          >
                            {l === 'pt' && 'Português'}
                            {l === 'ny' && 'Chichewa'}
                            {l === 'en' && 'English'}
                            {l === 'es' && 'Español'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-[9px] md:text-[10px] uppercase tracking-widest text-white/40 font-bold">{t.cast}</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedMovie.cast.map((actor) => (
                          <div key={actor} className="bg-white/5 border border-white/10 px-2.5 py-1.5 rounded-md flex items-center gap-2">
                            <span className="text-[10px] md:text-xs font-medium">{actor}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </ScrollArea>
                
                <div className="flex gap-3 md:gap-4 mt-auto">
                  <Button 
                    className="flex-grow bg-elegant-accent text-white hover:bg-elegant-accent/90 h-10 md:h-12 text-xs md:text-sm font-bold rounded-md"
                    onClick={() => setShowTrailer(true)}
                  >
                    Assistir ({audioLang === 'pt' ? 'PT' : audioLang === 'ny' ? 'NY' : audioLang === 'en' ? 'EN' : 'ES'})
                  </Button>
                  <Button variant="secondary" className="w-10 h-10 md:w-12 md:h-12 rounded-md border-white/10 bg-white/10 hover:bg-white/20" onClick={() => setSelectedMovie(null)}>
                    <X className="w-4 h-4 md:w-5 md:h-5" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Trailer Modal */}
      <Dialog open={showTrailer} onOpenChange={setShowTrailer}>
        <DialogContent className="max-w-5xl bg-black border-none p-0 overflow-hidden rounded-none md:rounded-xl aspect-video">
          {selectedMovie?.trailerUrl ? (
            <iframe
              width="100%"
              height="100%"
              src={`${selectedMovie.trailerUrl}?autoplay=1`}
              title={`${selectedMovie.title[lang]} Trailer`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          ) : (
            <div className="flex items-center justify-center h-full text-white">
              Trailer not available
            </div>
          )}
          <Button 
            variant="ghost" 
            className="absolute top-4 right-4 text-white hover:bg-white/10 rounded-full w-10 h-10 p-0"
            onClick={() => setShowTrailer(false)}
          >
            <X className="w-6 h-6" />
          </Button>
        </DialogContent>
      </Dialog>

      {/* Mobile Search Bar */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] z-50">
        <div className="bg-elegant-card border border-white/10 rounded-full p-2 flex items-center gap-2 shadow-2xl backdrop-blur-md">
          <Search className="text-elegant-muted w-5 h-5 ml-3" />
          <input
            type="text"
            placeholder={t.search}
            className="bg-transparent border-none text-white text-sm focus:outline-none flex-grow py-2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
