import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Upload } from 'lucide-react';
import { CountryDropdown } from '@/components/ui/country-dropdown';
import { countries } from 'country-data-list'; // Icon for the uploader

export default function SellGoldPage() {
  return (
    <div className="min-h-screen w-full bg-[#F9F9F9] px-4 py-12 sm:px-6 lg:py-20">
      <main className="mx-auto max-w-2xl">
        <div className="text-center">
          <h1 className="font-serif text-4xl font-medium text-black sm:text-5xl">Sell Your Gold</h1>
          <p className="mx-auto mt-4 max-w-xl text-neutral-600">
            Submit your gold details below and our specialists will provide you with a competitive
            quote shortly.
          </p>
        </div>

        <Card className="mt-10 border-neutral-200 bg-white shadow-none sm:mt-12">
          <CardHeader>
            <CardTitle className="font-sans text-xl font-semibold">Inquiry Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="full-name">Full Name</Label>
                  <Input
                    id="full-name"
                    placeholder="John Smith"
                    className="rounded-md border-neutral-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="rounded-md border-neutral-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone-number">Phone Number</Label>
                  <Input
                    id="phone-number"
                    placeholder="(555) 000-0000"
                    className="rounded-md border-neutral-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <CountryDropdown value={countries.all[0]}/>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" placeholder="New York" className="rounded-md border-neutral-300" />
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="item-type">Item Type</Label>
                  <Select>
                    <SelectTrigger className="w-full rounded-md border-neutral-300 text-neutral-500">
                      <SelectValue placeholder="Select item type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bar">Gold Bar</SelectItem>
                      <SelectItem value="coin">Gold Coin</SelectItem>
                      <SelectItem value="jewelry">Jewelry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="karat">Estimated Karat</Label>
                  <Select>
                    <SelectTrigger className="w-full rounded-md border-neutral-300 text-neutral-500">
                      <SelectValue placeholder="Select karat" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24">24K (99.9%)</SelectItem>
                      <SelectItem value="22">22K (91.7%)</SelectItem>
                      <SelectItem value="18">18K (75.0%)</SelectItem>
                      <SelectItem value="14">14K (58.3%)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">Estimated Weight</Label>
                <Input
                  id="weight"
                  placeholder="e.g., 100 grams or 3.2 oz"
                  className="rounded-md border-neutral-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="photo-upload">Photo Upload</Label>
                <div className="flex w-full items-center justify-center">
                  <label
                    htmlFor="dropzone-file"
                    className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-50 hover:bg-neutral-100"
                  >
                    <div className="flex flex-col items-center justify-center pb-6 pt-5">
                      <Upload className="mb-3 h-8 w-8 text-neutral-400" />
                      <p className="mb-2 text-sm text-neutral-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                        images
                      </p>
                      <p className="text-xs text-neutral-500">PNG, JPG up to 10MB</p>
                    </div>
                    <input id="dropzone-file" type="file" className="hidden" multiple />
                  </label>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full rounded-md bg-black py-6 text-base font-semibold text-white hover:bg-neutral-800"
                >
                  Submit Inquiry
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
