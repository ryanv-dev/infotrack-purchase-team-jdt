import './App.css'
import PropertyCard from './components/PropertyCard'

const propertyId = 1

function App() {
  return (
    <div className='w-full h-full'>
      <div className='flex justify-center items-center h-full'>
        <PropertyCard
          propertyId={propertyId} />
      </div>
    </div>
  )  
}

export default App