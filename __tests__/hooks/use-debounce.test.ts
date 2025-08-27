import { renderHook, act } from "@testing-library/react"
import { useDebounce } from "@/hooks/use-debounce"
import jest from "jest"

jest.useFakeTimers()

describe("useDebounce", () => {
  it("should return initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("initial", 500))
    expect(result.current).toBe("initial")
  })

  it("should debounce value changes", () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: "initial", delay: 500 },
    })

    expect(result.current).toBe("initial")

    // Change the value
    rerender({ value: "updated", delay: 500 })
    expect(result.current).toBe("initial") // Should still be initial

    // Fast forward time
    act(() => {
      jest.advanceTimersByTime(500)
    })

    expect(result.current).toBe("updated")
  })

  it("should reset timer on rapid changes", () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: "initial", delay: 500 },
    })

    rerender({ value: "change1", delay: 500 })
    act(() => {
      jest.advanceTimersByTime(250)
    })

    rerender({ value: "change2", delay: 500 })
    act(() => {
      jest.advanceTimersByTime(250)
    })

    expect(result.current).toBe("initial") // Should still be initial

    act(() => {
      jest.advanceTimersByTime(250)
    })

    expect(result.current).toBe("change2")
  })
})
