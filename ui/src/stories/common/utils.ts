import type { InternalProperty } from "@/types/internal-property";
import { AxiosError } from "axios";
import { http, HttpResponse, type DefaultBodyType } from "msw";
import testData, { type MockDataEntry } from "./mockData";
import { testUtil_inputMaskMode } from "@/components/EditVolFolDialog";
import { apiBaseUrl } from "@/api";

export const mockData: MockDataEntry[] = JSON.parse(JSON.stringify(testData))

const resetUtilities = () => {
  testUtil_inputMaskMode.enable()
}

export const resetMockData = () => {
  resetUtilities()
  
  mockData.length = 0
  testData.forEach(entry =>
    mockData.push(JSON.parse(JSON.stringify(entry)))
  )
}

export const findProperty = (propertyId: number) =>
  mockData.find(p => p.propertyId === propertyId)?.data

export const mswHandlers = [
  http.get<{id: string }, null, InternalProperty | AxiosError>(`${apiBaseUrl}/property/:id`, 
    ({ params }) => {
      const propertyId = Number(params.id)

      const fetchedData = findProperty(propertyId)

      if (fetchedData) {
        return HttpResponse.json(fetchedData)
      } else {
        const err = new AxiosError("Not Found")
        return HttpResponse.json(err, { status: 404 })
      }
  }),
  http.put<{id: string}, InternalProperty["volumeFolio"], DefaultBodyType | AxiosError>(`${apiBaseUrl}/property/:id/volume-folio`, 
    async({ request, params }) => {
      const propertyId = Number(params.id)
      const newVolFol = await request.json()
      const entryIndex = mockData.findIndex(p => p.propertyId == propertyId)
      const originalData = mockData[entryIndex]

      if (originalData) {
      const newData: InternalProperty = {
        ...originalData.data,
        volumeFolio: newVolFol,
        status: newVolFol && newVolFol.volume && newVolFol.folio
          ? "KnownVolFol"
          : "UnknownVolFol"
    }

    mockData[entryIndex] = { ...originalData, data: newData }
      return HttpResponse.json({ status: 201 })
    } else {
      const err = new AxiosError("Not Found")
      return HttpResponse.json(err, { status: 404 })
    }
  })
]

export const inputMaskModeManager = () => {
  let enabled = true;
 
  return {
    enable: () => { enabled = true; },
    disable: () => { enabled = false; },
    isEnabled: () => enabled,
  }
}