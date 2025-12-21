import { useEffect, useState } from 'react'
import ProgressSteps from '@/components/common/ProgressSteps'
import { getProcessingSteps, type ProcessingStep } from '@/data/SystemProcess'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'

interface Step {
  label: string
  status: 'complete' | 'current' | 'pending'
}

export default function ProcessingStateContent() {
  const navigate = useNavigate()
  const [isClient, setIsClient] = useState(true)
  const [steps, setSteps] = useState<Step[]>([])
  const [isComplete, setIsComplete] = useState(false)

  // SSG: Initialize with in-progress state
  useEffect(() => {
    // Hydration: Switch to pre-client state
    setIsClient(false)

    // Get initial processing steps
    const processingSteps = getProcessingSteps('in_progress')
    const initialSteps = processingSteps.map((step): Step => ({
      label: step.description,
      status: step.state === '✔' ? 'complete' : step.state === '⏳' ? 'current' : 'pending'
    }))
    setSteps(initialSteps)

    // Simulate processing completion
    const progressTimer = setTimeout(() => {
      // Update steps to complete
      const completeSteps = getProcessingSteps('complete')
      const completedSteps = completeSteps.map((step): Step => ({
        label: step.description,
        status: 'complete'
      }))
      setSteps(completedSteps)
      setIsComplete(true)

      // Auto-redirect after showing completion
      const redirectTimer = setTimeout(() => {
        navigate('/item-preview')
      }, 1500)

      return () => clearTimeout(redirectTimer)
    }, 3000)

    // Client: Restore to final state
    const raf = requestAnimationFrame(() => {
      setIsClient(true)
    })

    return () => {
      clearTimeout(progressTimer)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className={cn(
      'w-full max-w-md transition-opacity duration-300',
      (isClient || isComplete) ? 'opacity-100' : 'opacity-75'
    )}>
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-2xl font-semibold mb-2">
          Analyzing article...
        </h1>
        <p className="text-muted-foreground">
          This usually takes a few seconds
        </p>
      </div>

      {/* Progress Steps */}
      {(isClient || steps.length > 0) && (
        <ProgressSteps steps={steps} />
      )}

      {/* Completion message */}
      {isComplete && (
        <div className={cn(
          'mt-8 text-center transition-all duration-300',
          isComplete ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        )}>
          <p className="text-sm text-muted-foreground">
            Ready to preview your article...
          </p>
        </div>
      )}
    </div>
  )
}
