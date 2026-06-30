import { MapPin, Phone, User } from 'lucide-react';
import { useChurch } from '../context/ChurchContext';

export default function Branches() {
  const { data } = useChurch();
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Our Church Branches</h1>
        <p className="text-slate-600 mt-2">Find a Grace Covenant Church near you</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.branches.map(b => (
          <div key={b.id} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition border border-slate-100">
            <div className="aspect-[16/10] overflow-hidden">
              <img src={b.image} alt={b.name} className="w-full h-full object-cover hover:scale-105 transition duration-500" />
            </div>
            <div className="p-5">
              <h3 className="font-bold text-slate-900 text-lg mb-2">{b.name}</h3>
              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 text-amber-600 flex-shrink-0" />
                  <span>{b.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-amber-600 flex-shrink-0" />
                  <span>{b.pastor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-amber-600 flex-shrink-0" />
                  <span>{b.phone}</span>
                </div>
              </div>
              <button className="mt-4 w-full py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-sm font-medium">
                Get Directions
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
