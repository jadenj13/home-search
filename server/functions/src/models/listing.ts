import * as mongoose from 'mongoose';

interface ListingDoc extends mongoose.Document {
  address: string;
  askingPrice: string;
  ownersName: string;
  propertyDescription: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  imageUrl: string;
  userId: string;
}

const listingSchema = new mongoose.Schema({
  address: { type: String, required: true },
  askingPrice: { type: String, required: true },
  ownersName: { type: String, required: true },
  propertyDescription: { type: String, required: true },
  coordinates: { type: Object, index: true, required: true },
  imageUrl: { type: String, required: true },
  userId: { type: String, required: true, index: true },
});

const Listing = mongoose.model<ListingDoc>('listings', listingSchema);

export default Listing;
