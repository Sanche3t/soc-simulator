import questionsData from '../../../data/questions.json';
import answersData from '../../../data/correctAnswers.json';
import scenariosData from '../../../data/scenarios.json';

export async function POST(request) {
  try {
    const body = await request.json();
    const { scenarioId, responses } = body || {};

    if (!scenarioId || !responses) {
      return new Response(
        JSON.stringify({ error: 'Missing scenarioId or responses' }),
        { status: 400 }
      );
    }

    // Load datasets
    const scenario = scenariosData.scenarios.find((s) => s.id === scenarioId);
    if (!scenario) {
      return new Response(JSON.stringify({ error: 'Unknown scenarioId' }), {
        status: 400,
      });
    }

    const qset = questionsData[scenarioId] || [];
    const key = answersData[scenarioId];
    if (!key) {
      return new Response(JSON.stringify({ error: 'Missing answer key' }), {
        status: 500,
      });
    }

    // 1) Investigation points (auto-awarded on viewing)
    const investigationPoints = key.investigationPoints || scenario.investigationPoints || 0;

    // 2) Response actions scoring
    // - Sum points for correct checked actions
    // - Penalize -5 for any checked action that is incorrect
    const submittedActions = Array.isArray(responses.actions) ? responses.actions : [];
    const actionDefs = Array.isArray(scenario.actions) ? scenario.actions : [];

    let responsePoints = 0;
    let wrongActionPenalty = 0;

    // Map by id for quick lookup
    const actionMap = Object.fromEntries(actionDefs.map((a) => [a.id, a]));

    // Award for correct actions that are checked
    submittedActions.forEach((aid) => {
      const def = actionMap[aid];
      if (def) {
        if (def.correct) {
          responsePoints += def.points || 0;
        } else {
          wrongActionPenalty += 5; // penalty per brief
        }
      } else {
        // Unknown action id -> ignore (no points, no penalty)
      }
    });

    // Ransomware: Recovery decision extra scoring (radio)
    let recoveryPoints = 0;
    if (scenarioId === 'ransomware' && key.recovery) {
      const choice = responses.recovery; // expected: 'pay' | 'restore' | 'manual'
      if (choice && key.recovery.points && key.recovery.points[choice] != null) {
        recoveryPoints = key.recovery.points[choice] || 0;
      }
    }

    const responseScore = Math.max(0, responsePoints - wrongActionPenalty) + recoveryPoints;

    // 3) Documentation MCQs
    const submittedAnswers = responses.answers || {};

    let documentationPoints = 0;

    qset.forEach((q) => {
      if (q.type === 'single') {
        const userAns = submittedAnswers[q.id];
        const correct = key.answers[q.id];
        if (userAns && correct && userAns === correct) {
          documentationPoints += q.points || 0;
        }
      } else if (q.type === 'multiple') {
        const userArr = Array.isArray(submittedAnswers[q.id]) ? submittedAnswers[q.id] : [];
        const correctArr = Array.isArray(q.correctAnswers) ? q.correctAnswers : [];
        if (correctArr.length > 0) {
          const userCorrect = userArr.filter((a) => correctArr.includes(a)).length;
          const partial = (userCorrect / correctArr.length) * (q.points || 0);
          documentationPoints += partial;
        }
      }
    });

    // Assemble breakdown
    const maxScore = 100;
    const investigationScore = investigationPoints;
    const totalScore = Math.min(
      maxScore,
      Math.round(investigationScore + responseScore + documentationPoints)
    );

    const passed = totalScore >= 70;

    const breakdown = {
      investigation: Math.round(investigationScore),
      response: Math.round(responseScore),
      documentation: Math.round(documentationPoints),
      penalties: wrongActionPenalty,
      recovery: Math.round(recoveryPoints),
    };

    const result = {
      score: totalScore,
      passed,
      breakdown,
    };

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'Server error', details: String(err) }),
      { status: 500 }
    );
  }
}
