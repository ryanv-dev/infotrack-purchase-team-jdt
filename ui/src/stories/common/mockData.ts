import type { InternalProperty } from "@/types/internal-property"

export type MockDataEntry = {
  propertyId: number
  data: InternalProperty
}

const testData: MockDataEntry[] = [
  {
    "propertyId": 1,
    "data": {
      "fullAddress": "10 Example St, Carlton VIC 3053",
      "lotPlan": {
        "lot": "12",
        "plan": "PS123456"
      },
      "volumeFolio": {
        "volume": "123456",
        "folio": "12"
      },
      "status": "KnownVolFol",
      "sourceTrace": {
        "provider": "VIC-DDP",
        "requestId": "REQ-12345",
        "receivedAt": "2025-08-30T03:12:45+00:00"
      }
    }
  },
  {
    "propertyId": 2,
    "data": {
      "fullAddress": "25 Sample Rd, Sydney NSW 2000",
      "lotPlan": {
        "lot": "45",
        "plan": "DP987654"
      },
      "volumeFolio": {
        "volume": "654321",
        "folio": "34"
      },
      "status": "KnownVolFol",
      "sourceTrace": {
        "provider": "NSW-Land",
        "requestId": "REQ-67890",
        "receivedAt": "2025-09-01T14:25:30+00:00"
      }
    }
  },
  {
    "propertyId": 3,
    "data": {
      "fullAddress": "77 High St, Brisbane QLD 4000",
      "lotPlan": {
        "lot": "7",
        "plan": "RP543210"
      },
      "volumeFolio": {
        "volume": "7777",
        "folio": "77"
      },
      "status": "KnownVolFol",
      "sourceTrace": {
        "provider": "QLD-Registry",
        "requestId": "REQ-77777",
        "receivedAt": "2025-09-10T09:45:00+00:00"
      }
    }
  },
  {
    "propertyId": 4,
    "data": {
      "fullAddress": "5 Ocean Dr, Perth WA 6000",
      "lotPlan": {
        "lot": "88",
        "plan": "WA123789"
      },
      "volumeFolio": {
        "volume": null,
        "folio": null
      },
      "status": "UnknownVolFol",
      "sourceTrace": {
        "provider": "WA-Landgate",
        "requestId": "REQ-88888",
        "receivedAt": "2025-09-20T12:00:00+00:00"
      }
    }
  }
]

export default testData
