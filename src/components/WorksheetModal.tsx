import { useEffect, useState } from 'react';
import {
  X,
  Download,
  Printer,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import { formatTrackLabel, type LessonDefinition } from '../data/lessons';
import { LESSON_WORKSHEETS } from '../data/worksheets';
import { downloadLessonWorksheetPdf } from '../utils/worksheetPdf';

interface WorksheetModalProps {
  lesson: LessonDefinition;
  studentName?: string;
  onPdfDownloaded?: () => void;
  onClose: () => void;
}

export function WorksheetModal({
  lesson,
  studentName,
  onPdfDownloaded,
  onClose,
}: WorksheetModalProps) {
  const [includeAnswerKey, setIncludeAnswerKey] = useState(true);
  const [includeHints, setIncludeHints] = useState(true);
  const [downloaded, setDownloaded] = useState(false);

  const spec = LESSON_WORKSHEETS[lesson.id];

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  function handleDownloadPdf() {
    downloadLessonWorksheetPdf(lesson, {
      includeAnswerKey,
      includeHints,
      studentName,
    });
    onPdfDownloaded?.();
    setDownloaded(true);
    window.setTimeout(() => setDownloaded(false), 2600);
  }

  function handlePrint() {
    window.print();
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-[2px] flex items-center justify-center p-4 sm:p-6 print:static print:bg-white print:p-0 print:block"
      role="dialog"
      aria-modal="true"
      aria-labelledby="worksheet-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-slate-50 border border-slate-200 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-xl print:max-h-none print:max-w-none print:border-0 print:shadow-none print:rounded-none print:bg-white">
        {/* Sticky Modal Action Bar (hidden when printing) */}
        <div className="bg-white border-b border-slate-200 px-5 py-4 flex flex-wrap items-center justify-between gap-4 shrink-0 print:hidden">
          <div className="flex items-center gap-2.5 min-w-0">
            <FileText className="w-5 h-5 text-blue-700 shrink-0" aria-hidden="true" />
            <div className="min-w-0">
              <h2
                id="worksheet-modal-title"
                className="text-base font-bold text-slate-900 truncate"
              >
                Printable PDF Worksheet · Lesson {String(lesson.order).padStart(2, '0')}
              </h2>
              <p className="text-xs text-slate-500 truncate">
                {lesson.title} · {spec.practiceProblems.length} Offline Practice Problems
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              {downloaded ? (
                <>
                  <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                  <span>PDF Downloaded</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" aria-hidden="true" />
                  <span>Download PDF</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Printer className="w-4 h-4" aria-hidden="true" />
              <span>Print</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close worksheet preview"
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Options Strip (hidden when printing) */}
        <div className="bg-slate-100/80 border-b border-slate-200 px-5 py-2.5 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-700 shrink-0 print:hidden">
          <div className="flex flex-wrap items-center gap-5">
            <label className="inline-flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeHints}
                onChange={(e) => setIncludeHints(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-blue-700 focus:ring-blue-600 cursor-pointer"
              />
              <span className="font-medium">Include Hints on Worksheet</span>
            </label>
            <label className="inline-flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeAnswerKey}
                onChange={(e) => setIncludeAnswerKey(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-blue-700 focus:ring-blue-600 cursor-pointer"
              />
              <span className="font-medium">Include Answer Key (Separate Page)</span>
            </label>
          </div>
          <span className="font-mono text-[11px] text-slate-500">
            US Letter (8.5 × 11 in)
          </span>
        </div>

        {/* Scrollable Paper Worksheet Preview */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 print:overflow-visible print:p-0">
          <article className="bg-white border border-slate-200 rounded-xl p-6 sm:p-10 shadow-xs space-y-6 max-w-3xl mx-auto print:border-0 print:shadow-none print:p-0 print:max-w-none">
            {/* Sheet Header */}
            <header className="pb-4 border-b border-slate-200 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="font-bold tracking-wide text-blue-700 uppercase">
                  Cheshbon · Offline Math Worksheet
                </span>
                <div className="flex flex-wrap items-center gap-4 text-slate-600 font-medium">
                  <span>
                    Name:{' '}
                    {studentName ? (
                      <strong className="text-slate-900 underline decoration-slate-300 underline-offset-4">
                        {studentName}
                      </strong>
                    ) : (
                      '_______________________'
                    )}
                  </span>
                  <span>Date: _____________</span>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-500 mb-1">
                  Lesson {String(lesson.order).padStart(2, '0')} · {formatTrackLabel(lesson.track)} ·{' '}
                  {lesson.sourceRef} · {lesson.mathTopic} · {lesson.ageRange}
                </p>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-2xl font-bold text-slate-900">
                    {lesson.title}
                  </h3>
                  <span
                    dir="rtl"
                    className="text-lg font-semibold text-blue-800"
                  >
                    {lesson.hebrewTitle}
                  </span>
                </div>
              </div>
            </header>

            {/* Main Math Concept & Formula Box */}
            <section className="bg-slate-50 border border-slate-200 rounded-lg p-5 space-y-3">
              <h4 className="text-sm font-bold text-blue-900">
                Main Math Concept: {spec.conceptTitle}
              </h4>
              <p className="text-sm text-slate-700 leading-relaxed">
                {spec.conceptSummary}
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-md px-4 py-2.5 font-mono text-xs font-semibold text-blue-900 tabular-nums">
                {spec.keyFormula}
              </div>
            </section>

            {/* Step-by-Step Worked Example */}
            <section className="bg-white border border-slate-200 rounded-lg p-5 space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wide text-emerald-700">
                Step-by-Step Worked Example
              </h4>
              <p className="text-sm font-semibold text-slate-900">
                Example: {spec.workedExample.problem}
              </p>
              <ol className="list-decimal list-inside space-y-1 text-sm text-slate-700">
                {spec.workedExample.steps.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ol>
              <p className="font-mono text-xs font-bold text-emerald-800 pt-1 tabular-nums">
                Answer: {spec.workedExample.answer}
              </p>
            </section>

            {/* Practice Problems */}
            <section className="space-y-5">
              <h4 className="text-base font-bold text-slate-900">
                Practice Problems (Show Your Work!)
              </h4>

              <div className="space-y-5">
                {spec.practiceProblems.map((prob) => (
                  <div key={prob.number} className="space-y-2 break-inside-avoid">
                    <p className="text-sm font-semibold text-slate-900 leading-snug">
                      {prob.number}.{' '}
                      {prob.isBonus && (
                        <span className="text-amber-700">[Bonus] </span>
                      )}
                      {prob.prompt}
                    </p>
                    {includeHints && (
                      <p className="text-xs italic text-amber-800 pl-3">
                        Hint: {prob.hint}
                      </p>
                    )}
                    <div className="h-20 rounded-lg border border-slate-300 bg-white p-3 flex flex-col justify-between">
                      <span className="text-[11px] text-slate-400">
                        Show your work here:
                      </span>
                      <span className="text-xs font-semibold text-slate-600 self-end">
                        Answer: ________________________
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Optional Answer Key Section */}
            {includeAnswerKey && (
              <section className="pt-6 border-t-2 border-dashed border-slate-300 space-y-4 print:break-before-page print:border-t-0 print:pt-0">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
                    Teacher &amp; Parent Answer Key
                  </p>
                  <h4 className="text-lg font-bold text-slate-900">
                    Lesson {String(lesson.order).padStart(2, '0')}: {lesson.title}
                  </h4>
                </div>

                <div className="space-y-2.5">
                  {spec.practiceProblems.map((prob) => (
                    <div
                      key={prob.number}
                      className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-sm"
                    >
                      <p className="font-semibold text-emerald-800">
                        Problem {prob.number}: {prob.answer}
                      </p>
                      <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                        {prob.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </article>
        </div>
      </div>
    </div>
  );
}
