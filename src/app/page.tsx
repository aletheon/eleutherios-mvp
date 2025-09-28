export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold text-center">
        🏠 Eleutherios PFSD Protocol
      </h1>
      <p className="mt-4 text-lg text-center text-gray-600">
        Governance through Love in Action
      </p>
      <div className="mt-8 p-6 border rounded-lg shadow-lg max-w-md">
        <h2 className="text-xl font-semibold mb-4">Ready to coordinate:</h2>
        <ul className="space-y-2">
          <li className="flex items-center">
            <span className="text-green-500 mr-2">✓</span>
            Homeless individuals seeking housing
          </li>
          <li className="flex items-center">
            <span className="text-green-500 mr-2">✓</span>
            MSD case workers
          </li>
          <li className="flex items-center">
            <span className="text-green-500 mr-2">✓</span>
            KO representatives
          </li>
        </ul>
      </div>
      <div className="mt-6 text-sm text-gray-500">
        PFSD Protocol: Policy → Forum → Service → Data
      </div>
    </main>
  )
}
