import { jsPDF } from 'jspdf';
import { formatTrackLabel, type LessonDefinition } from '../data/lessons';
import { LESSON_WORKSHEETS } from '../data/worksheets';

export interface WorksheetPdfOptions {
  includeAnswerKey: boolean;
  includeHints: boolean;
  studentName?: string;
}

/**
 * Normalizes Unicode symbols and strips RTL Hebrew glyphs so jsPDF's built-in
 * Helvetica/Courier fonts render every line crisply without broken characters.
 */
function toPdfSafeText(input: string): string {
  return input
    .replace(/[\u0590-\u05FF]+/g, '')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[—–]/g, ' - ')
    .replace(/−/g, '-')
    .replace(/×/g, 'x')
    .replace(/÷/g, '/')
    .replace(/≈/g, '~')
    .replace(/≥/g, '>=')
    .replace(/≤/g, '<=')
    .replace(/π/g, 'pi')
    .replace(/→/g, '->')
    .replace(/…/g, '...')
    .replace(/·/g, '|')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

export function getWorksheetFilename(lesson: LessonDefinition): string {
  const num = String(lesson.order).padStart(2, '0');
  return `cheshbon-lesson-${num}-${lesson.id}-worksheet.pdf`;
}

export function downloadLessonWorksheetPdf(
  lesson: LessonDefinition,
  options: WorksheetPdfOptions = { includeAnswerKey: true, includeHints: true }
): void {
  const spec = LESSON_WORKSHEETS[lesson.id];
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'letter',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 612pt
  const pageHeight = doc.internal.pageSize.getHeight(); // 792pt
  const margin = 44;
  const contentWidth = pageWidth - margin * 2;
  const footerSafeY = pageHeight - 54;

  let y = 44;

  const ensureSpace = (neededHeight: number) => {
    if (y + neededHeight > footerSafeY) {
      doc.addPage();
      y = 48;
    }
  };

  // --- TOP HEADER BAND ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(29, 78, 216); // Sapphire blue
  doc.text('CHESHBON  |  OFFLINE MATH WORKSHEET', margin, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(71, 85, 105);
  const cleanName = options.studentName
    ? toPdfSafeText(options.studentName)
    : '';
  const nameLine = cleanName
    ? `Name: ${cleanName}    Date: ______________`
    : 'Name: ____________________________    Date: ______________';
  doc.text(nameLine, pageWidth - margin, y, {
    align: 'right',
  });

  y += 10;
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(1);
  doc.line(margin, y, pageWidth - margin, y);

  // --- LESSON TITLE & METADATA ---
  y += 22;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(100, 116, 139);
  const lessonNum = String(lesson.order).padStart(2, '0');
  const metaLine = toPdfSafeText(
    `Lesson ${lessonNum} | ${formatTrackLabel(lesson.track)} | ${lesson.sourceRef} | ${lesson.mathTopic} | ${lesson.ageRange}`
  );
  doc.text(metaLine, margin, y);

  y += 20;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(19);
  doc.setTextColor(15, 23, 42);
  const titleLines = doc.splitTextToSize(toPdfSafeText(lesson.title), contentWidth);
  doc.text(titleLines, margin, y);
  y += titleLines.length * 22 + 4;

  // --- MAIN MATH CONCEPT & FORMULA BOX ---
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const conceptLines = doc.splitTextToSize(
    toPdfSafeText(spec.conceptSummary),
    contentWidth - 28
  );
  const formulaLines = doc.splitTextToSize(
    toPdfSafeText(spec.keyFormula),
    contentWidth - 40
  );
  const conceptBoxHeight =
    26 + conceptLines.length * 14 + 14 + formulaLines.length * 13 + 18;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(1);
  doc.roundedRect(margin, y, contentWidth, conceptBoxHeight, 6, 6, 'FD');

  let boxY = y + 18;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(30, 58, 138);
  doc.text(toPdfSafeText(`Main Math Concept: ${spec.conceptTitle}`), margin + 14, boxY);

  boxY += 16;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.8);
  doc.setTextColor(51, 65, 85);
  doc.text(conceptLines, margin + 14, boxY);
  boxY += conceptLines.length * 14 + 8;

  // Key Formula Sub-Box
  const formulaRectH = formulaLines.length * 13 + 14;
  doc.setFillColor(239, 246, 255);
  doc.setDrawColor(191, 219, 254);
  doc.roundedRect(margin + 12, boxY - 8, contentWidth - 24, formulaRectH, 4, 4, 'FD');
  doc.setFont('courier', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(29, 78, 216);
  doc.text(formulaLines, margin + 20, boxY + 4);

  y += conceptBoxHeight + 14;

  // --- WORKED EXAMPLE BOX ---
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  const exProblemLines = doc.splitTextToSize(
    toPdfSafeText(`Example: ${spec.workedExample.problem}`),
    contentWidth - 28
  );
  const exStepBlocks = spec.workedExample.steps.map((s, idx) =>
    doc.splitTextToSize(toPdfSafeText(`${idx + 1}. ${s}`), contentWidth - 36)
  );
  const totalStepLines = exStepBlocks.reduce((acc, lines) => acc + lines.length, 0);
  const exampleBoxH =
    24 + exProblemLines.length * 13 + totalStepLines * 13 + 22;

  ensureSpace(exampleBoxH + 12);
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, contentWidth, exampleBoxH, 6, 6, 'FD');

  let exY = y + 17;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(4, 120, 87);
  doc.text('Step-by-Step Worked Example', margin + 14, exY);

  exY += 15;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text(exProblemLines, margin + 14, exY);
  exY += exProblemLines.length * 13 + 4;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.3);
  doc.setTextColor(51, 65, 85);
  for (const lines of exStepBlocks) {
    doc.text(lines, margin + 22, exY);
    exY += lines.length * 13;
  }

  exY += 4;
  doc.setFont('courier', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(4, 120, 87);
  doc.text(toPdfSafeText(`Answer: ${spec.workedExample.answer}`), margin + 14, exY);

  y += exampleBoxH + 20;

  // --- PRACTICE PROBLEMS SECTION ---
  ensureSpace(32);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text('Practice Problems (Show Your Work!)', margin, y);
  y += 14;

  for (const prob of spec.practiceProblems) {
    const labelPrefix = prob.isBonus
      ? `${prob.number}. [Bonus] `
      : `${prob.number}. `;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.2);
    const promptLines = doc.splitTextToSize(
      toPdfSafeText(`${labelPrefix}${prob.prompt}`),
      contentWidth - 16
    );

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8.8);
    const hintLines = options.includeHints
      ? doc.splitTextToSize(toPdfSafeText(`Hint: ${prob.hint}`), contentWidth - 20)
      : [];

    const workBoxHeight = prob.isBonus ? 64 : 56;
    const blockHeight =
      promptLines.length * 13.5 +
      (hintLines.length > 0 ? hintLines.length * 11.5 + 4 : 0) +
      workBoxHeight +
      16;

    ensureSpace(blockHeight);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.2);
    doc.setTextColor(15, 23, 42);
    doc.text(promptLines, margin, y);
    y += promptLines.length * 13.5 + 2;

    if (hintLines.length > 0) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8.8);
      doc.setTextColor(146, 64, 14); // Warm amber hint text
      doc.text(hintLines, margin + 8, y);
      y += hintLines.length * 11.5 + 4;
    }

    // Show-Your-Work box
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.8);
    doc.roundedRect(margin, y, contentWidth, workBoxHeight, 4, 4, 'FD');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text('Show your work here:', margin + 8, y + 12);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(51, 65, 85);
    doc.text(
      'Answer: ________________________',
      pageWidth - margin - 10,
      y + workBoxHeight - 10,
      { align: 'right' }
    );

    y += workBoxHeight + 14;
  }

  // --- OPTIONAL ANSWER KEY PAGE ---
  if (options.includeAnswerKey) {
    doc.addPage();
    y = 48;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(4, 120, 87);
    doc.text('CHESHBON  |  TEACHER & PARENT ANSWER KEY', margin, y);

    y += 10;
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(1);
    doc.line(margin, y, pageWidth - margin, y);

    y += 24;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(15, 23, 42);
    doc.text(
      toPdfSafeText(`Lesson ${lessonNum}: ${lesson.title} - Answer Key`),
      margin,
      y
    );

    y += 24;

    for (const prob of spec.practiceProblems) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      const ansLines = doc.splitTextToSize(
        toPdfSafeText(`Problem ${prob.number}: ${prob.answer}`),
        contentWidth - 24
      );
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      const expLines = doc.splitTextToSize(
        toPdfSafeText(prob.explanation),
        contentWidth - 24
      );

      const cardH = 18 + ansLines.length * 13 + expLines.length * 13 + 12;
      ensureSpace(cardH + 10);

      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(margin, y, contentWidth, cardH, 5, 5, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(4, 120, 87);
      doc.text(ansLines, margin + 12, y + 18);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(51, 65, 85);
      doc.text(expLines, margin + 12, y + 18 + ansLines.length * 13 + 3);

      y += cardH + 10;
    }
  }

  // --- FOOTERS ON ALL PAGES ---
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.75);
    doc.line(margin, pageHeight - 38, pageWidth - margin, pageHeight - 38);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text(
      toPdfSafeText(
        `Cheshbon Math Studio  |  ${formatTrackLabel(lesson.track)} (${lesson.sourceRef})`
      ),
      margin,
      pageHeight - 24
    );
    doc.text(`Page ${p} of ${totalPages}`, pageWidth - margin, pageHeight - 24, {
      align: 'right',
    });
  }

  doc.save(getWorksheetFilename(lesson));
}
