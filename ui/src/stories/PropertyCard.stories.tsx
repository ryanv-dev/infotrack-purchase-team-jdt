import PropertyCard from '@/components/PropertyCard'
import type { InternalProperty } from '@/types/internal-property'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { expect, waitFor, within } from 'storybook/test'
import { resetMockData, mswHandlers, findProperty } from './common/utils';
import { testUtil_inputMaskMode } from '@/components/EditVolFolDialog';

const meta = {
  title: 'App/PropertyCard',
  component: PropertyCard,
  excludeStories: /^testUtil/,
  decorators:[
    (Story) => {
      resetMockData()

      return <Story/>
    }
  ],
  parameters: {
    layout: 'centered',
    msw: {  
      handlers: mswHandlers
    }
  },
  tags: ['autodocs'],
  argTypes: {
  }
} satisfies Meta<typeof PropertyCard>;

export default meta;

type Story = StoryObj<typeof meta>;

// PropertyCard With No Data
// ========================================================
const property2Id = 2
export const RenderPropertyCardWithNoData: Story = {
  args: {
    propertyId: property2Id
  },
  play: async({ canvas }) => {
    const property2 = findProperty(property2Id)

    const lotPlanValue = (await canvas.findByTestId("property-lot-plan")).textContent
    const volumeFolioValue = (await canvas.findByTestId("property-vol-fol")).textContent
    const volumeFolioStatus = (await canvas.findByTestId("property-status")).textContent
    
    expect(lotPlanValue).toBe(`${property2?.lotPlan?.lot}/${property2?.lotPlan?.plan}`)
    expect(volumeFolioValue).toBe(`${property2?.volumeFolio?.volume}/${property2?.volumeFolio?.folio}`)
    expect(volumeFolioStatus).toBe(property2?.status)
  }
};

// PropertyCard With Data
// ========================================================
const property1Id = 1
export const RenderPropertyCardWithData: Story = {
  args: {
    propertyId: property1Id,
    data: findProperty(property1Id)
  },
  play: async({ canvas }) => {
    const lotPlanValue = (await canvas.findByTestId("property-lot-plan")).textContent
    const volumeFolioValue = (await canvas.findByTestId("property-vol-fol")).textContent
    const volumeFolioStatus = (await canvas.findByTestId("property-status")).textContent

    const property1 = findProperty(property1Id)
    
    expect(lotPlanValue).toBe(`${property1?.lotPlan?.lot}/${property1?.lotPlan?.plan}`)
    expect(volumeFolioValue).toBe(`${property1?.volumeFolio.volume}/${property1?.volumeFolio.folio}`)
    expect(volumeFolioStatus).toBe(property1?.status)
  }
};

// PropertyCard With Non-Existent Data
// ========================================================
const property5Id = 5
export const RenderPropertyCardNotExist: Story = {
  args: {
    propertyId: property5Id
  },
  play: async({ canvas }) => {
    expect(await canvas.findByText(`Not Found`)).toBeInTheDocument()
  }
};

// PropertyCard With Lot Plan Data
// ========================================================
const partialLotPlanProperty: InternalProperty = {
  "fullAddress": "25 Sample Rd, Sydney NSW 2000",
  "lotPlan": {
    "lot": "45",
  },
  "volumeFolio": {
    "volume": "12345",
    "folio": "1232"
  },
  "status": "KnownVolFol",
  "sourceTrace": {
    "provider": "NSW-Land",
    "requestId": "REQ-67890",
    "receivedAt": "2025-09-01T14:25:30+00:00"
  }
}

export const RenderPropertyCardWithPartialLotPlanData: Story = {
  args: {
    propertyId: 2,
    data: partialLotPlanProperty
  },
  play: async({ canvas }) => {
    const lotPlanValue = (await canvas.findByTestId("property-lot-plan")).textContent
    const volumeFolioValue = (await canvas.findByTestId("property-vol-fol")).textContent
    const volumeFolioStatus = (await canvas.findByTestId("property-status")).textContent
    
    expect(lotPlanValue).toBe("N/A")
    expect(volumeFolioValue).toBe(`${partialLotPlanProperty.volumeFolio?.volume}/${partialLotPlanProperty.volumeFolio?.folio}`)
    expect(volumeFolioStatus).toBe(partialLotPlanProperty.status)
  }
}

// PropertyCard With No Lot Plan Data
// ========================================================
const missingLotPlanProperty: InternalProperty = {
  "fullAddress": "25 Sample Rd, Sydney NSW 2000",
  "lotPlan": {
    "lot": "45",
    "plan": "DP987654"
  },
  "volumeFolio": {
    "volume": "12345",
    "folio": "1232"
  },
  "status": "KnownVolFol",
  "sourceTrace": {
    "provider": "NSW-Land",
    "requestId": "REQ-67890",
    "receivedAt": "2025-09-01T14:25:30+00:00"
  }
}

export const RenderPropertyCardWithNoLotPlanData: Story = {
  args: {
    propertyId: 2,
    data: missingLotPlanProperty
  },
  play: async({ canvas }) => {
    const lotPlanValue = (await canvas.findByTestId("property-lot-plan")).textContent
    const volumeFolioValue = (await canvas.findByTestId("property-vol-fol")).textContent
    const volumeFolioStatus = (await canvas.findByTestId("property-status")).textContent
    
    expect(lotPlanValue).toBe(`${missingLotPlanProperty.lotPlan?.lot}/${missingLotPlanProperty.lotPlan?.plan}`)
    expect(volumeFolioValue).toBe(`${missingLotPlanProperty.volumeFolio?.volume}/${missingLotPlanProperty.volumeFolio?.folio}`)
    expect(volumeFolioStatus).toBe(missingLotPlanProperty.status)
  }
}

// PropertyCard With Partial Volume Folio Data
// ========================================================
const partialVolumeFolioProperty: InternalProperty = {
  "fullAddress": "25 Sample Rd, Sydney NSW 2000",
  "lotPlan": {
    "lot": "45",
    "plan": "DP987654"
  },
  "volumeFolio": {
    "volume": "12345",
    "folio": null
  },
  "status": "UnknownVolFol",
  "sourceTrace": {
    "provider": "NSW-Land",
    "requestId": "REQ-67890",
    "receivedAt": "2025-09-01T14:25:30+00:00"
  }
}
export const RenderPropertyCardWithPartialVolumeFolioData: Story = {
  args: {
    propertyId: 2,
    data: partialVolumeFolioProperty
  },
  play: async({ canvas }) => {
    const lotPlanValue = (await canvas.findByTestId("property-lot-plan")).textContent
    const volumeFolioValue = (await canvas.findByTestId("property-vol-fol")).textContent
    const volumeFolioStatus = (await canvas.findByTestId("property-status")).textContent
    
    expect(lotPlanValue).toBe(`${partialVolumeFolioProperty.lotPlan?.lot}/${partialVolumeFolioProperty.lotPlan?.plan}`)
    expect(volumeFolioValue).toBe("N/A")
    expect(volumeFolioStatus).toBe(partialVolumeFolioProperty.status)
  }
}

// PropertyCard With Empty Volume Folio Data
// ========================================================
const emptyVolumeFolioProperty: InternalProperty = {
  "fullAddress": "25 Sample Rd, Sydney NSW 2000",
  "lotPlan": {
    "lot": "45",
    "plan": "DP987654"
  },
  "volumeFolio": {
    "volume": null,
    "folio": null
  },
  "status": "UnknownVolFol",
  "sourceTrace": {
    "provider": "NSW-Land",
    "requestId": "REQ-67890",
    "receivedAt": "2025-09-01T14:25:30+00:00"
  }
}
export const RenderPropertyCardWithEmptyVolumeFolioData: Story = {
  args: {
    propertyId: 2,
    data: emptyVolumeFolioProperty
  },
  play: async({ canvas }) => {
    const lotPlanValue = (await canvas.findByTestId("property-lot-plan")).textContent
    const volumeFolioValue = (await canvas.findByTestId("property-vol-fol")).textContent
    const volumeFolioStatus = (await canvas.findByTestId("property-status")).textContent
    
    expect(lotPlanValue).toBe(`${emptyVolumeFolioProperty.lotPlan?.lot}/${emptyVolumeFolioProperty.lotPlan?.plan}`)
    expect(volumeFolioValue).toBe("N/A")
    expect(volumeFolioStatus).toBe(emptyVolumeFolioProperty.status)
  }
}

// ========================================================
// Open Modal
// ========================================================
const property3Id = 3
// ========================================================
export const OpenModal: Story = {
  args: {
    propertyId: property3Id,
    data: findProperty(property3Id)
  },
  play: async({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button"))

    const dialog = document.querySelector("[role=dialog]") as HTMLElement
    await expect(within(dialog).getByText("Confirm")).toBeDisabled()
  }
}

// Open Modal With Empty Volume Data Entry
// ========================================================
export const OpenModalWithEmptyVolumeDataEntry: Story = {
  args: {
    propertyId: property3Id,
    data: findProperty(property3Id)
  },
  play: async({ canvas, userEvent }) => {
    await userEvent.click(await canvas.findByRole("button"))

    const dialog = document.querySelector("[role=dialog]") as HTMLElement
    await userEvent.clear(within(dialog).getByLabelText("Volume"))
    await userEvent.clear(within(dialog).getByLabelText("Folio"))
    
    await expect(within(dialog).getByText("Confirm")).not.toBeDisabled()
  }
}

// Open Modal With New Invalid Volume Folio Entry
// ========================================================
const invalidVolumeFolioEntry = {
  volume: "abc",
  folio: "123456"
}

export const OpenModalWithNewInvalidVolumeFolioEntry: Story = {
  args: {
    propertyId: property3Id,
    data: findProperty(property3Id)
  },
  play: async({ canvas, userEvent }) => {
    testUtil_inputMaskMode.disable()
    await userEvent.click(canvas.getByRole("button"))

    const dialog = document.querySelector("[role=dialog]") as HTMLElement
    const volumeInput = within(dialog).getByLabelText("Volume")
    const folioInput = within(dialog).getByLabelText("Folio")

    await userEvent.clear(volumeInput)
    await userEvent.type(volumeInput, invalidVolumeFolioEntry.volume)
    await userEvent.clear(folioInput)
    await userEvent.type(folioInput, invalidVolumeFolioEntry.folio)
    await userEvent.click(dialog)
    
    await expect(within(dialog).getByText("Volume must be 1-6 digits")).toBeInTheDocument()
    await expect(within(dialog).getByText("Folio must be 1-5 digits")).toBeInTheDocument()
    await expect(within(dialog).getByText("Confirm")).toBeDisabled()
  }
}

// Open Modal With New Volume Folio Entry Then Close
// ========================================================
const validVolumeFolioEntry = {
  volume: "1342",
  folio: "12322"
}

export const OpenModalWithNewVolumeFolioEntryThenClose: Story = {
  args: {
    propertyId: property3Id,
  },
  play: async({ canvas, userEvent }) => {
    const property = findProperty(property3Id)

    await userEvent.click(await canvas.findByRole("button"))

    const dialog = document.querySelector("[role=dialog]") as HTMLElement
    const volumeInput = within(dialog).getByLabelText("Volume")
    const folioInput = within(dialog).getByLabelText("Folio")

    await userEvent.clear(volumeInput)
    await userEvent.type(volumeInput, validVolumeFolioEntry.volume)
    await userEvent.clear(folioInput)
    await userEvent.type(folioInput, validVolumeFolioEntry.folio)
    await userEvent.click(dialog)
    
    await expect(within(dialog).getByText("Confirm")).not.toBeDisabled()
    
    await userEvent.click(within(dialog).getAllByText("Close").at(0)!)

    const lotPlanValue = (await canvas.findByTestId("property-lot-plan")).textContent
    const volumeFolioValue = (await canvas.findByTestId("property-vol-fol")).textContent
    const volumeFolioStatus = (await canvas.findByTestId("property-status")).textContent
    
    await expect(lotPlanValue).toBe(`${property?.lotPlan?.lot}/${property?.lotPlan?.plan}`)
    await expect(volumeFolioValue).toBe(`${property?.volumeFolio?.volume}/${property?.volumeFolio?.folio}`)
    await expect(volumeFolioStatus).toBe(property?.status)
  }
}

// Open Modal And Update New Volume Folio Entry
// ========================================================
const volumeFolioEntry = {
  volume: "1342",
  folio: "12322"
}

export const OpenModalAndUpdateNewVolumeFolioEntry: Story = {
  args: {
    propertyId: property3Id,
  },
  play: async({ canvas, userEvent }) => {
    await userEvent.click(await canvas.findByRole("button"))

    const dialog = document.querySelector("[role=dialog]") as HTMLElement
    const volumeInput = within(dialog).getByLabelText("Volume")
    const folioInput = within(dialog).getByLabelText("Folio")

    await userEvent.clear(volumeInput)
    await userEvent.type(volumeInput, volumeFolioEntry.volume)
    await userEvent.clear(folioInput)
    await userEvent.type(folioInput, volumeFolioEntry.folio)
    await userEvent.click(dialog)

    await expect(within(dialog).getByText("Confirm")).not.toBeDisabled()

    await userEvent.click(within(dialog).getByText("Confirm"))

    const property = findProperty(property3Id)

    await waitFor(() => {
      const lotPlanEl = canvas.getByTestId("property-lot-plan")
      const volumeFolioValueEl = canvas.getByTestId("property-vol-fol")
      const volumeFolioStatusEl = canvas.getByTestId("property-status")

      expect(lotPlanEl.textContent)
        .toBe(`${property?.lotPlan?.lot}/${property?.lotPlan?.plan}`)
      expect(volumeFolioValueEl.textContent)
        .toBe(`${volumeFolioEntry.volume}/${volumeFolioEntry.folio}`)
      expect(volumeFolioStatusEl.textContent)
        .toBe("KnownVolFol")
    })
  }
}