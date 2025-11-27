import './App.css'
import { authClient } from './lib/auth.ts'

function App() {
	const { data, error } = authClient.useSession()

	return <div>{JSON.stringify({ data, error })}</div>
}

export default App
