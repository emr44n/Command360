# Seed Data and Starter Templates

## Purpose

Seed data helps Claude build and test the product quickly. These templates should appear in the app so the platform feels like an emergency services training tool from the first demo.

## Starter organisation

```json
{
  "name": "Command360 Demo Service",
  "sector": "fire",
  "brand": {
    "primaryColor": "#0B1F33",
    "accentColor": "#2DD4BF",
    "fontFamily": "Inter"
  }
}
```

## Starter workspaces

```json
[
  {
    "name": "Incident Command Training",
    "description": "Training sessions and scenarios for incident command development."
  },
  {
    "name": "Control Room Training",
    "description": "Call handling, dispatch, escalation and command support exercises."
  },
  {
    "name": "Multi-Agency Exercises",
    "description": "Joint exercises for fire, police, ambulance and partner agencies."
  }
]
```

## Presentation template 1, Initial Incident Command Refresher

### Title

Initial Incident Command Refresher

### Description

A short interactive session for refreshing early incident command decision-making.

### Slides

#### Slide 1, title

Title: Initial Incident Command Refresher

Subtitle: Situational awareness, priorities and decision-making.

#### Slide 2, content

Title: Session aims

Body:

- Review initial incident command priorities.
- Practise tactical decision-making.
- Discuss dynamic risk assessment.
- Capture confidence before and after the scenario.

#### Slide 3, multiple choice poll

Question:

What is your first priority when taking command of an escalating incident?

Options:

- Commit crews immediately.
- Establish command, gather information and assess risk.
- Wait for a senior officer.
- Focus only on media and public information.

Preferred answer:

Establish command, gather information and assess risk.

#### Slide 4, word cloud

Prompt:

What one word describes effective incident command?

#### Slide 5, ranking

Prompt:

Rank these early priorities.

Items:

- Life risk
- Scene safety
- Information gathering
- Resource request
- Tactical plan

#### Slide 6, open text

Prompt:

What information would you request from the first crew on scene?

#### Slide 7, confidence scale

Prompt:

How confident are you in explaining your initial command priorities?

Scale:

1 to 5

#### Slide 8, debrief reflection

Prompt:

What would you do differently next time?

## Presentation template 2, Dynamic Risk Assessment

### Slides

1. Title, Dynamic Risk Assessment
2. Content, Risk versus benefit
3. Poll, Which factor changes your tactical mode first?
4. Scenario decision, Smoke worsening at first floor
5. Open text, Explain your command message
6. Q&A, Instructor-led discussion
7. Debrief reflection, One learning point

## Scenario template 1, House Fire, Persons Reported

### Description

Two-storey domestic property with reports of persons inside. Smoke conditions worsen during the exercise.

### Scenes

#### Scene 1, Initial arrival

Visual:

- Two-storey house background.
- Light smoke overlay.
- Appliance marker.

Instructor note:

Trainees should establish command, gather information and identify life risk.

#### Scene 2, Smoke increasing

Visual:

- Heavier smoke overlay.
- First-floor smoke marker.
- Radio message audio.

Instructor note:

Prompt trainees to review risk and resource needs.

#### Scene 3, Casualty reported

Visual:

- Casualty marker appears near rear bedroom.
- Warning banner: Person reported first floor.

Instructor note:

Discuss tactical priorities and crew safety.

#### Scene 4, Debrief freeze frame

Visual:

- Freeze scene.
- Key decision points listed.

Instructor note:

Review command messages, risk assessment and tactical mode.

### Events

#### Event 1, Increase smoke

Trigger label:

Increase Smoke

Actions:

- Show heavy smoke layer.
- Fade in over 3 seconds.
- Play radio crackle.

#### Event 2, Casualty located

Trigger label:

Casualty Located

Actions:

- Show casualty marker.
- Show alert banner.
- Play short radio message.

#### Event 3, Water supply issue

Trigger label:

Water Supply Issue

Actions:

- Show text inject.
- Play radio message.

#### Event 4, Tactical withdrawal

Trigger label:

Withdrawal

Actions:

- Show warning banner.
- Fade scene darker.
- Play evacuation tone optional.

## Scenario template 2, Road Traffic Collision

### Description

Two-vehicle RTC with one trapped casualty and traffic hazard.

### Scenes

- Initial scene with two vehicles.
- Police cordon scene.
- Fire rescue operations scene.
- Ambulance handover scene.

### Events

- Casualty deteriorates.
- Fuel leak identified.
- Road closure delay.
- Additional resource arrives.

## Scenario template 3, Control Room Escalation

### Description

A call handling and dispatch exercise where information develops over time.

### Scenes

- Initial call summary.
- Multiple calls received.
- Resource pressure.
- Major incident consideration.

### Events

- New caller information.
- Conflicting information.
- Appliance unavailable.
- Senior officer requested.

## Starter media placeholders

Create placeholder records even if media files are not available yet.

Media records:

- house_background_day.jpg
- house_background_night.jpg
- smoke_light.webm
- smoke_heavy.webm
- fire_window_flicker.webm
- rain_overlay.webm
- blue_light_reflection.webm
- casualty_marker.png
- hazard_marker.png
- sector_marker.png
- wind_arrow.png
- radio_crackle.mp3
- radio_message_1.mp3
- siren_short.mp3
- alert_banner.png

## Starter slide types

Seed these slide type definitions:

- content
- multiple_choice
- word_cloud
- open_text
- quiz
- q_and_a
- ranking
- scale
- scenario_decision
- debrief_reflection

## Starter themes

### Command360 Dark

```json
{
  "name": "Command360 Dark",
  "background": "#07111F",
  "panel": "#0B1F33",
  "text": "#FFFFFF",
  "mutedText": "#A8B3C5",
  "accent": "#2DD4BF",
  "warning": "#F59E0B",
  "danger": "#EF4444"
}
```

### Command360 Light

```json
{
  "name": "Command360 Light",
  "background": "#F8FAFC",
  "panel": "#FFFFFF",
  "text": "#0B1F33",
  "mutedText": "#64748B",
  "accent": "#0EA5E9",
  "warning": "#D97706",
  "danger": "#DC2626"
}
```

## Demo script for testing

Use this script to test the MVP:

1. Log in as instructor.
2. Open dashboard.
3. Create Initial Incident Command Refresher from template.
4. Start live session.
5. Open audience display in another tab.
6. Join session from another browser tab using join code.
7. Answer the multiple choice poll.
8. Reveal results.
9. Open Command Studio.
10. Create House Fire, Persons Reported scenario.
11. Add placeholder background.
12. Add smoke overlay.
13. Create Increase Smoke event.
14. Open Studio output route.
15. Trigger Increase Smoke.
16. End session.
17. Open results page.
18. Confirm poll result and event timeline appear.

## Demo participant groups

Seed optional groups:

- Red Team
- Blue Team
- Green Team
- Sector 1
- Sector 2
- Command Team

## Demo roles

Seed optional participant roles:

- Incident Commander
- Sector Commander
- Safety Officer
- Control Room Operator
- Crew Manager
- Watch Manager
- Observer

## Template principle

Every template should teach a practical command decision, not only ask generic questions.
