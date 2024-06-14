import { useEffect, useMemo, useRef, useState } from 'react'

import styles from './Shape.module.css'

// create a shape based on the 2D array
// empty box where value === 1
// when value === 0 then render nothing
// we can select a box and change background color to green
// deselect in order of selection
// disable any interaction

// 2D Array
// [[], [], []]

type ShapeProps = {
  data: number[][]
}

const Shape = ({ data }: ShapeProps) => {
  const [selected, setSelected] = useState(new Set())
  const [unloading, setUnloading] = useState(false)

  const timerRef = useRef<number | undefined>(undefined)

  const boxes = useMemo(() => data.flat(Infinity), [data])
  const countOfVisibleBoxes = useMemo(() => {
    return boxes.reduce((acc: number, box) => {
      if (box === 1) {
        acc += 1
      }

      return acc
    }, 0)
  }, [boxes])

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement
    const index = target.getAttribute('data-index')
    const status = target.getAttribute('data-status')

    if (!index || status === 'hidden' || selected.has(index) || unloading) {
      return
    }

    setSelected(prev => {
      return new Set(prev.add(index))
    })
  }

  const unload = () => {
    setUnloading(true)

    const keys = Array.from(selected.keys())

    const removeNextKey = () => {
      if (keys.length) {
        const currentKey = keys.shift()

        setSelected(prev => {
          const updatedKeys = new Set(prev)
          updatedKeys.delete(currentKey)
          return updatedKeys
        })

        timerRef.current = setTimeout(removeNextKey, 500)
      } else {
        setUnloading(false)
        clearTimeout(timerRef.current)
      }
    }

    timerRef.current = setTimeout(removeNextKey, 100)
  }

  useEffect(() => {
    if (selected.size >= countOfVisibleBoxes) {
      unload()
    }
  }, [selected])

  return (
    <div className={styles.boxes} onClick={e => handleClick(e)}>
      {boxes.map((box, index) => {
        const status = box === 1 ? 'visible' : 'hidden'
        const isSelected = selected.has(index.toString())

        return (
          <div
            key={`${box}-${index}`}
            className={`${styles.box} ${styles[status]} ${
              isSelected ? styles.selected : ''
            }`}
            data-index={index}
            data-status={status}
          />
        )
      })}
    </div>
  )
}

export default Shape
