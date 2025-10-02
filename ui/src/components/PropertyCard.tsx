import { CircleCheckBigIcon, CircleQuestionMark, House } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { InternalProperty, InternalPropertyState } from '@/types/internal-property';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import EditVolFol from './EditVolFolDialog';
import { Badge } from './ui/badge';
import PropertyService from '@/api/property-service';
import clsx from 'clsx';
import { Skeleton } from './ui/skeleton';

function PropertyCard({ propertyId, data }: InternalPropertyState) {
  const [property, setProperty] = useState<InternalProperty>();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(!data);

  useEffect(() => {
    setError(undefined);
    setProperty(undefined);
    setLoading(true);

    const fetch = async () => {
        await PropertyService.getProperty(propertyId)
          .then(res => {
            setProperty(res);
          })
          .catch(err => setError(err.response?.statusText || err.message || 'Error fetching property'))
          .finally(() => setLoading(false));
      }
    
    if (data) {
      setProperty(data);
      setLoading(false);
    } else {
      fetch()
    }
  }, [propertyId, data]);

  if (loading && !property && !error) return <Skeleton className="w-[400px] h-40" />

  const cardContentRowClass = "flex sm:flex-row sm:justify-between sm:items-center sm:gap-0 flex-col items-start gap-0.5";

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle className="text-start leading-normal" data-testid="property-full-address">
          <div className={clsx('flex gap-2.5', { 'text-destructive': error })}>
            {error ? <CircleQuestionMark className="size-4" /> : <House className="size-4" />}
            <div>
              <p className='text-xs text-slate-800 mb-1'>PROPERTY #{propertyId}</p>
              <p>{error ?? property?.fullAddress}</p>
            </div>
          </div>
        </CardTitle>
      </CardHeader>

      {!error && property && (
        <CardContent>
          <div className="flex flex-col sm:gap-0 gap-2">
            <div className={cardContentRowClass}>
              <span className="font-medium">Lot/Plan</span>
              <span className='py-2' data-testid="property-lot-plan">
                { property.lotPlan && property.lotPlan.lot && property.lotPlan.plan 
                  ? `${property.lotPlan.lot}/${property.lotPlan.plan}` 
                  : 'N/A' }
              </span>
            </div>

            <div className={cardContentRowClass}>
              <span className="font-medium">Volume/Folio</span>
              <EditVolFol context={{ propertyId, data: property }} setProperty={setProperty} />
            </div>

            <div className={cardContentRowClass}>
              <span className="font-medium">Status</span>
              <span className='py-2'>{property.status && (
                <Badge variant="secondary" data-testid="property-status" className="flex gap-1.5">
                  {property.status === 'UnknownVolFol' ? <CircleQuestionMark size={15} /> : <CircleCheckBigIcon size={15} />}
                  {property.status}
                </Badge>
              )}</span>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

export default PropertyCard;