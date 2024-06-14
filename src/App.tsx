import Shape from './components/Shape'

const BOX_DATA = [
  [1, 1, 1],
  [1, 0, 0],
  [1, 1, 1]
]

function App() {
  return (
    <main>
      <Shape data={BOX_DATA} />
    </main>
  )
}

export default App
