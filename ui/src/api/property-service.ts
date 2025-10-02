import type { InternalProperty } from "@/types/internal-property";
import axiosApi from ".";

async function getProperty(id: number) {
    const { data } = await axiosApi.get<InternalProperty>(`/property/${id}`);
    return data;
}

type VolumeFolio = InternalProperty["volumeFolio"]
async function updateVolumeFolio(id: number, volFol: InternalProperty["volumeFolio"]) {
    await axiosApi.put<VolumeFolio>(`/property/${id}/volume-folio`, volFol)
}

const PropertyService = {
    getProperty,
    updateVolumeFolio
}

export default PropertyService