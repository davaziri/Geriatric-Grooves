import type { BodyFocus, Equipment, EnvironmentTag } from "@geriatric-grooves/shared";

export interface SeedExercise {
  id: string;
  name: string;
  description: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  durationEstimateSeconds: number;
  equipmentRequired: Equipment[];
  environmentTags: EnvironmentTag[];
  bodyFocus: BodyFocus[];
  modifications: string;
  cautions?: string;
}

// 38 exercises spanning difficulty 1-5, every equipment type, every
// environment tag, and every body focus area. Every entry's `modifications`
// field names a seated/chair-assisted alternative, per the accessibility
// requirement that no exercise excludes someone who can't stand or get to
// the floor.
export const exerciseSeedData: SeedExercise[] = [
  {
    id: "seated-neck-tilts",
    name: "Seated Neck Tilts",
    description:
      "Sit tall, relax your shoulders, and gently tilt one ear toward that shoulder until you feel a light stretch on the other side. Hold, then return to center and repeat on the other side.",
    difficulty: 1,
    durationEstimateSeconds: 60,
    equipmentRequired: ["none"],
    environmentTags: ["open_floor", "small_space", "has_chair"],
    bodyFocus: ["upper_body"],
    modifications:
      "Easier: make the tilt smaller and hold for less time. Harder: add a gentle hand rest on the tilted side of your head for a slightly deeper stretch. Already seated — no changes needed for a chair.",
    cautions: "Move slowly. Stop if you feel dizzy.",
  },
  {
    id: "seated-shoulder-rolls",
    name: "Seated Shoulder Rolls",
    description:
      "Sit comfortably and lift both shoulders up toward your ears, then roll them back and down in a smooth circle. Repeat, then reverse direction.",
    difficulty: 1,
    durationEstimateSeconds: 60,
    equipmentRequired: ["none"],
    environmentTags: ["small_space", "has_chair"],
    bodyFocus: ["upper_body"],
    modifications:
      "Easier: do smaller circles. Harder: hold light weights or full water bottles in each hand while you roll. Already seated — works the same standing if you prefer.",
  },
  {
    id: "seated-ankle-circles",
    name: "Seated Ankle Circles",
    description:
      "Sit and lift one foot slightly off the floor. Slowly trace a circle in the air with your toes, then switch directions. Repeat with the other foot.",
    difficulty: 1,
    durationEstimateSeconds: 60,
    equipmentRequired: ["none"],
    environmentTags: ["small_space", "has_chair"],
    bodyFocus: ["lower_body"],
    modifications:
      "Easier: keep your heel on the floor and just circle your toes. Harder: hold each circle direction for 10 rotations before switching. Already seated.",
  },
  {
    id: "seated-marching",
    name: "Seated Marching",
    description:
      "Sit toward the front of a sturdy chair. Lift one knee up like a slow march, lower it, then lift the other. Keep a steady, comfortable pace.",
    difficulty: 1,
    durationEstimateSeconds: 90,
    equipmentRequired: ["chair"],
    environmentTags: ["has_chair", "small_space"],
    bodyFocus: ["lower_body"],
    modifications:
      "Easier: lift your knees just an inch or two. Harder: add a light ankle weight or hold the pose at the top for a second. Already seated.",
  },
  {
    id: "standing-wall-pushups",
    name: "Standing Wall Push-Ups",
    description:
      "Stand facing a wall, an arm's length away, and place both palms flat on it at shoulder height. Bend your elbows to bring your chest toward the wall, then push back to start.",
    difficulty: 2,
    durationEstimateSeconds: 90,
    equipmentRequired: ["wall"],
    environmentTags: ["open_floor"],
    bodyFocus: ["upper_body"],
    modifications:
      "Easier: stand closer to the wall to reduce the angle. Harder: step your feet farther back. Seated alternative: press both palms together at chest height and push them into each other instead.",
  },
  {
    id: "chair-assisted-sit-to-stand",
    name: "Chair-Assisted Sit-to-Stand",
    description:
      "Sit toward the edge of a sturdy chair with feet flat on the floor. Lean slightly forward and stand up slowly, using your hands on the armrests or seat for support if needed, then sit back down with control.",
    difficulty: 2,
    durationEstimateSeconds: 90,
    equipmentRequired: ["chair"],
    environmentTags: ["has_chair"],
    bodyFocus: ["lower_body"],
    modifications:
      "Easier: use your hands fully to push up, or choose a taller chair. Harder: cross your arms over your chest and stand without using your hands. Already includes a seated starting position.",
    cautions: "Make sure the chair won't slide — place it against a wall or on a non-slip surface.",
  },
  {
    id: "seated-cat-cow",
    name: "Seated Cat-Cow Stretch",
    description:
      "Sit tall with hands on your knees. Inhale, arch your back gently and lift your chest (cow), then exhale, round your spine and drop your chin (cat). Move slowly between the two.",
    difficulty: 1,
    durationEstimateSeconds: 60,
    equipmentRequired: ["chair"],
    environmentTags: ["has_chair", "small_space"],
    bodyFocus: ["full_flexibility"],
    modifications:
      "Easier: make the arch and round very small. Harder: pause and hold each position for a few extra breaths. Already seated.",
  },
  {
    id: "standing-side-bend-wall",
    name: "Standing Side Bend (Wall-Supported)",
    description:
      "Stand next to a wall with one hand resting on it for balance. Reach your other arm up and over toward the wall, gently bending your torso to that side. Return to standing and repeat on the other side.",
    difficulty: 2,
    durationEstimateSeconds: 90,
    equipmentRequired: ["wall"],
    environmentTags: ["open_floor"],
    bodyFocus: ["full_flexibility"],
    modifications:
      "Easier: bend a smaller amount and keep both hands available near the wall. Harder: hold the stretch a few seconds longer on each side. Seated alternative: do the same reach-and-bend while sitting tall in a chair.",
  },
  {
    id: "heel-to-toe-balance-walk",
    name: "Heel-to-Toe Balance Walk",
    description:
      "Using a railing or countertop for light support, walk forward placing the heel of one foot directly in front of the toes of the other, as if walking a line.",
    difficulty: 3,
    durationEstimateSeconds: 90,
    equipmentRequired: ["none"],
    environmentTags: ["has_railing", "open_floor"],
    bodyFocus: ["balance"],
    modifications:
      "Easier: leave a small gap between heel and toe instead of touching, and keep a hand on the railing the whole time. Harder: try it without touching the railing, ready to catch yourself if needed. Seated alternative: practice heel-to-toe foot placements while seated, tapping one foot in front of the other.",
    cautions: "Only try the harder version if you feel steady. Stop if you feel dizzy or unsteady.",
  },
  {
    id: "single-leg-stand-chair",
    name: "Single-Leg Stand (Chair Support)",
    description:
      "Stand behind a sturdy chair, holding the back with both hands. Lift one foot slightly off the floor and hold your balance, then switch feet.",
    difficulty: 2,
    durationEstimateSeconds: 60,
    equipmentRequired: ["chair"],
    environmentTags: ["has_chair"],
    bodyFocus: ["balance"],
    modifications:
      "Easier: keep your lifted foot's toe touching the floor for extra stability. Harder: hold with just one hand, or let go briefly. Seated alternative: sit and lift one knee up, holding it a few inches off an imaginary floor.",
  },
  {
    id: "seated-torso-twist",
    name: "Seated Torso Twist",
    description:
      "Sit tall with feet flat on the floor. Cross your arms over your chest and gently twist your upper body to one side, then the other, keeping your hips facing forward.",
    difficulty: 1,
    durationEstimateSeconds: 60,
    equipmentRequired: ["chair"],
    environmentTags: ["has_chair", "small_space"],
    bodyFocus: ["core"],
    modifications:
      "Easier: twist a smaller amount. Harder: hold a light weight or water bottle against your chest as you twist. Already seated.",
  },
  {
    id: "standing-hip-circles-wall",
    name: "Standing Hip Circles (Wall-Supported)",
    description:
      "Stand with one hand on a wall for balance. Place your other hand on your hip and make slow, gentle circles with your hips, like a soft hula motion.",
    difficulty: 2,
    durationEstimateSeconds: 60,
    equipmentRequired: ["wall"],
    environmentTags: ["open_floor"],
    bodyFocus: ["lower_body"],
    modifications:
      "Easier: make very small circles. Harder: make wider circles and reverse direction. Seated alternative: sit and gently rock your hips in a circle on the seat of the chair.",
  },
  {
    id: "resistance-band-seated-row",
    name: "Resistance Band Seated Row",
    description:
      "Sit tall in a chair, loop a resistance band around your feet, and hold one end in each hand. Pull the band back by squeezing your shoulder blades together, then slowly release.",
    difficulty: 3,
    durationEstimateSeconds: 90,
    equipmentRequired: ["resistance_band", "chair"],
    environmentTags: ["has_chair"],
    bodyFocus: ["upper_body"],
    modifications:
      "Easier: use a looser grip on the band for less resistance or loop it less tightly. Harder: hold the squeeze for 2-3 seconds each pull. Already seated.",
  },
  {
    id: "resistance-band-seated-leg-press",
    name: "Resistance Band Seated Leg Press",
    description:
      "Sit in a chair and loop a resistance band around one foot, holding the ends near your hip. Press that foot forward against the band, straightening your leg, then slowly bend it back.",
    difficulty: 3,
    durationEstimateSeconds: 90,
    equipmentRequired: ["resistance_band", "chair"],
    environmentTags: ["has_chair"],
    bodyFocus: ["lower_body"],
    modifications:
      "Easier: press out only partway. Harder: press all the way out and hold for 2 seconds before releasing. Already seated.",
  },
  {
    id: "standing-calf-raises-chair",
    name: "Standing Calf Raises",
    description:
      "Stand behind a chair, holding the back with both hands. Slowly rise up onto your toes, then lower back down with control.",
    difficulty: 2,
    durationEstimateSeconds: 60,
    equipmentRequired: ["chair"],
    environmentTags: ["has_chair", "open_floor"],
    bodyFocus: ["lower_body"],
    modifications:
      "Easier: rise up just a small amount. Harder: hold at the top for 2 seconds before lowering. Seated alternative: sit and lift your heels off the floor while keeping your toes down, then lower.",
  },
  {
    id: "stair-step-ups-railing",
    name: "Step-Ups on Stairs (Railing-Assisted)",
    description:
      "Stand at the bottom of a staircase holding the railing. Step up onto the first stair with one foot, bring the other foot up to meet it, then step back down the same way.",
    difficulty: 4,
    durationEstimateSeconds: 120,
    equipmentRequired: ["stairs"],
    environmentTags: ["has_stairs", "has_railing"],
    bodyFocus: ["lower_body"],
    modifications:
      "Easier: hold the railing with both hands and go slowly, one step at a time without alternating lead foot. Harder: alternate which foot leads each time. Seated alternative: do Chair-Assisted Sit-to-Stand instead, which builds the same leg strength.",
    cautions: "Only do this if you feel steady on stairs and always keep a hand on the railing. Skip this one if stairs make you nervous.",
  },
  {
    id: "seated-forward-fold",
    name: "Seated Forward Fold",
    description:
      "Sit toward the front of a chair with feet flat on the floor, hip-width apart. Slowly hinge forward from your hips, letting your hands rest on your thighs or reach toward your shins.",
    difficulty: 2,
    durationEstimateSeconds: 60,
    equipmentRequired: ["chair"],
    environmentTags: ["has_chair"],
    bodyFocus: ["full_flexibility"],
    modifications:
      "Easier: fold forward just a little. Harder: reach your hands closer to your ankles or the floor. Already seated.",
    cautions: "Avoid if you have vertigo or low blood pressure that causes dizziness when bending forward. Come back up slowly.",
  },
  {
    id: "wall-angels",
    name: "Wall Angels",
    description:
      "Stand with your back against a wall, arms bent at your sides like a goalpost. Slowly slide your arms up the wall, then back down, keeping your back and arms touching the wall as much as you can.",
    difficulty: 3,
    durationEstimateSeconds: 90,
    equipmentRequired: ["wall"],
    environmentTags: ["open_floor"],
    bodyFocus: ["upper_body"],
    modifications:
      "Easier: move through a smaller range and don't worry if your arms lift off the wall. Harder: slow the movement down even more. Seated alternative: sit tall and do the same arm movement without the wall, focusing on squeezing your shoulder blades.",
  },
  {
    id: "standing-quad-stretch-chair",
    name: "Standing Quad Stretch (Chair-Supported)",
    description:
      "Stand beside a chair, holding the back with one hand. Bend your other knee to bring your heel toward your seat, holding your ankle gently if you can reach it, then switch legs.",
    difficulty: 2,
    durationEstimateSeconds: 60,
    equipmentRequired: ["chair"],
    environmentTags: ["has_chair"],
    bodyFocus: ["full_flexibility"],
    modifications:
      "Easier: don't worry about grabbing your ankle — just bend your knee as far as feels comfortable. Harder: hold the stretch a few seconds longer. Seated alternative: sit and slide one foot back under the chair, bending the knee to feel a gentle stretch.",
  },
  {
    id: "resistance-band-seated-bicep-curl",
    name: "Resistance Band Seated Bicep Curl",
    description:
      "Sit in a chair with a resistance band looped under both feet. Hold one end in each hand, palms facing up, and curl your hands toward your shoulders, then lower slowly.",
    difficulty: 2,
    durationEstimateSeconds: 60,
    equipmentRequired: ["resistance_band", "chair"],
    environmentTags: ["has_chair"],
    bodyFocus: ["upper_body"],
    modifications:
      "Easier: use a shorter band length for less resistance. Harder: pause for a second at the top of each curl. Already seated.",
  },
  {
    id: "standing-toe-taps",
    name: "Standing Toe Taps",
    description:
      "Stand tall with feet hip-width apart. Tap one foot forward, then back to start, then tap it out to the side. Repeat with the other foot.",
    difficulty: 2,
    durationEstimateSeconds: 60,
    equipmentRequired: ["none"],
    environmentTags: ["open_floor", "small_space"],
    bodyFocus: ["balance"],
    modifications:
      "Easier: hold onto a wall or countertop while tapping. Harder: tap a little farther out each time. Seated alternative: sit and tap your foot forward and to the side without putting weight on it.",
  },
  {
    id: "chair-yoga-warrior",
    name: "Chair Yoga Warrior Pose",
    description:
      "Sit sideways on a chair with one leg extended back and the other bent in front. Reach both arms overhead and hold, feeling a gentle stretch through your hips and shoulders.",
    difficulty: 3,
    durationEstimateSeconds: 90,
    equipmentRequired: ["chair"],
    environmentTags: ["has_chair"],
    bodyFocus: ["full_flexibility"],
    modifications:
      "Easier: keep your arms at shoulder height instead of overhead. Harder: hold the pose a few breaths longer. Already seated.",
  },
  {
    id: "standing-hamstring-stretch-chair",
    name: "Standing Hamstring Stretch (Chair-Supported)",
    description:
      "Stand behind a chair and rest one heel on the seat with a slightly bent knee. Hold the chair back for balance and hinge gently forward from your hips until you feel a stretch behind your thigh.",
    difficulty: 2,
    durationEstimateSeconds: 60,
    equipmentRequired: ["chair"],
    environmentTags: ["has_chair"],
    bodyFocus: ["full_flexibility"],
    modifications:
      "Easier: keep the resting knee bent more and hinge forward less. Harder: straighten the resting leg a bit more. Seated alternative: sit and extend one leg out straight, gently reaching toward your foot.",
  },
  {
    id: "wall-sit-light",
    name: "Wall Sit (Light)",
    description:
      "Stand with your back against a wall and slowly slide down until your knees are bent at a comfortable angle, like sitting in an invisible chair. Hold, then slide back up.",
    difficulty: 4,
    durationEstimateSeconds: 60,
    equipmentRequired: ["wall"],
    environmentTags: ["open_floor"],
    bodyFocus: ["lower_body"],
    modifications:
      "Easier: only bend your knees slightly and hold for a shorter time. Harder: bend a bit deeper and hold a few seconds longer. Seated alternative: do Chair-Assisted Sit-to-Stand instead for similar leg strengthening without the wall hold.",
    cautions: "Avoid a deep bend if you have knee pain. Keep the hold short and comfortable.",
  },
  {
    id: "resistance-band-lateral-walk",
    name: "Resistance Band Lateral Walk",
    description:
      "Loop a resistance band around your legs just above the ankles and stand with feet hip-width apart. Take small sideways steps in one direction, then the other, keeping tension on the band.",
    difficulty: 4,
    durationEstimateSeconds: 90,
    equipmentRequired: ["resistance_band"],
    environmentTags: ["open_floor"],
    bodyFocus: ["lower_body"],
    modifications:
      "Easier: use a looser band placement (around the thighs) for less resistance and take smaller steps. Harder: take wider steps. Seated alternative: sit with the band around your ankles and press your knees outward against it, then release.",
    cautions: "Do this near a wall or counter you can reach for balance if needed.",
  },
  {
    id: "seated-ankle-pumps",
    name: "Seated Ankle Pumps",
    description:
      "Sit with your legs extended or feet flat on the floor. Point your toes away from you, then flex them back up toward your shins. Repeat at a comfortable pace.",
    difficulty: 1,
    durationEstimateSeconds: 60,
    equipmentRequired: ["none"],
    environmentTags: ["small_space", "has_chair"],
    bodyFocus: ["lower_body"],
    modifications:
      "Easier: do a smaller range of motion. Harder: hold each point and flex for 3 seconds. Already seated.",
  },
  {
    id: "standing-balance-eyes-closed",
    name: "Standing Balance with Eyes Closed",
    description:
      "Stand near a wall (not touching it) with feet together. Once you feel steady, close your eyes for a few seconds and notice your balance, opening your eyes right away if you feel unsteady.",
    difficulty: 5,
    durationEstimateSeconds: 45,
    equipmentRequired: ["wall"],
    environmentTags: ["open_floor"],
    bodyFocus: ["balance"],
    modifications:
      "Easier: keep your eyes open, or keep a hand lightly on the wall the whole time. Harder: try shifting your weight slightly side to side with your eyes closed. Seated alternative: sit and close your eyes while lifting one foot slightly off the floor.",
    cautions: "Only try this with a wall or sturdy surface within arm's reach. Stop immediately if you feel unsteady.",
  },
  {
    id: "light-weight-seated-overhead-press",
    name: "Light Weight Seated Overhead Press",
    description:
      "Sit tall holding a light weight or full water bottle in each hand at shoulder height. Press both hands up overhead, then lower back to shoulder height with control.",
    difficulty: 3,
    durationEstimateSeconds: 90,
    equipmentRequired: ["light_weights", "chair"],
    environmentTags: ["has_chair"],
    bodyFocus: ["upper_body"],
    modifications:
      "Easier: press up only partway, or use no added weight. Harder: pause for a second at the top of each press. Already seated.",
  },
  {
    id: "light-weight-seated-row",
    name: "Light Weight Seated Row",
    description:
      "Sit tall holding a light weight in each hand, arms extended forward. Pull your elbows back, squeezing your shoulder blades together, then extend your arms forward again.",
    difficulty: 3,
    durationEstimateSeconds: 90,
    equipmentRequired: ["light_weights", "chair"],
    environmentTags: ["has_chair"],
    bodyFocus: ["upper_body"],
    modifications:
      "Easier: use no added weight and focus on the squeezing motion. Harder: hold the squeeze for 2-3 seconds each time. Already seated.",
  },
  {
    id: "standing-march-high-knees-railing",
    name: "Standing March with High Knees (Railing-Assisted)",
    description:
      "Stand holding a railing or sturdy counter with one hand. March in place, lifting your knees as high as comfortably possible, one at a time.",
    difficulty: 4,
    durationEstimateSeconds: 90,
    equipmentRequired: ["none"],
    environmentTags: ["has_railing", "open_floor"],
    bodyFocus: ["lower_body"],
    modifications:
      "Easier: lift your knees just a little and hold the railing with both hands. Harder: pick up the pace slightly. Seated alternative: do Seated Marching instead.",
  },
  {
    id: "seated-knee-lifts-core",
    name: "Seated Knee Lifts",
    description:
      "Sit tall with your hands resting on the sides of the chair for support. Lift one knee up toward your chest, then lower it slowly, engaging your stomach muscles. Repeat on the other side.",
    difficulty: 2,
    durationEstimateSeconds: 60,
    equipmentRequired: ["chair"],
    environmentTags: ["has_chair"],
    bodyFocus: ["core"],
    modifications:
      "Easier: lift your knee just a small amount. Harder: hold the lifted position for 2-3 seconds. Already seated.",
  },
  {
    id: "standing-pelvic-tilts-wall",
    name: "Standing Pelvic Tilts (Wall-Supported)",
    description:
      "Stand with your back against a wall, knees slightly bent. Gently flatten your lower back against the wall by tilting your pelvis, then release back to a neutral stance.",
    difficulty: 2,
    durationEstimateSeconds: 60,
    equipmentRequired: ["wall"],
    environmentTags: ["open_floor"],
    bodyFocus: ["core"],
    modifications:
      "Easier: use a smaller tilt. Harder: hold the flattened position for 3-5 seconds. Seated alternative: sit tall and gently rock your pelvis forward and back while seated.",
  },
  {
    id: "full-body-seated-stretch-flow",
    name: "Full Body Seated Stretch Flow",
    description:
      "Sitting in a chair, move slowly through a series of gentle stretches: reach both arms overhead, then out to the sides, then hug yourself gently, pausing a few breaths at each position.",
    difficulty: 1,
    durationEstimateSeconds: 120,
    equipmentRequired: ["chair"],
    environmentTags: ["has_chair", "small_space"],
    bodyFocus: ["full_flexibility"],
    modifications:
      "Easier: skip any position that feels uncomfortable. Harder: hold each stretch a few breaths longer. Already seated.",
  },
  {
    id: "stair-calf-stretch-railing",
    name: "Stair Calf Stretch (Railing-Assisted)",
    description:
      "Holding the railing, stand on the bottom stair with your heels hanging slightly off the edge. Gently lower your heels down below the step level to feel a stretch in your calves, then rise back up.",
    difficulty: 3,
    durationEstimateSeconds: 60,
    equipmentRequired: ["stairs"],
    environmentTags: ["has_stairs", "has_railing"],
    bodyFocus: ["full_flexibility"],
    modifications:
      "Easier: lower your heels just slightly and hold the railing with both hands. Harder: hold the stretch a few seconds longer. Seated alternative: sit and loop a towel around the ball of one foot, gently pulling your toes toward you.",
    cautions: "Keep a firm grip on the railing at all times. Skip this one if stairs make you unsteady.",
  },
  {
    id: "resistance-band-seated-chest-press",
    name: "Resistance Band Seated Chest Press",
    description:
      "Sit tall in a chair with a resistance band looped behind your upper back, holding one end in each hand at chest height. Press both hands forward until your arms are extended, then slowly bring them back.",
    difficulty: 3,
    durationEstimateSeconds: 90,
    equipmentRequired: ["resistance_band", "chair"],
    environmentTags: ["has_chair"],
    bodyFocus: ["upper_body"],
    modifications:
      "Easier: press forward only partway. Harder: pause for a second with arms fully extended. Already seated.",
  },
  {
    id: "advanced-single-leg-balance",
    name: "Advanced Single-Leg Balance (No Support)",
    description:
      "Stand tall in open floor space, away from furniture. Lift one foot slightly off the ground and hold your balance without touching anything for support, then switch feet.",
    difficulty: 5,
    durationEstimateSeconds: 45,
    equipmentRequired: ["none"],
    environmentTags: ["open_floor"],
    bodyFocus: ["balance"],
    modifications:
      "Easier: do this near a wall or chair so support is within reach. Harder: try holding for a slightly longer count each time. Seated alternative: do Single-Leg Stand (Chair Support) instead.",
    cautions: "Only attempt this if Single-Leg Stand (Chair Support) already feels easy and steady for you.",
  },
  {
    id: "standing-figure-4-stretch-chair",
    name: "Standing Figure-4 Stretch (Chair-Supported)",
    description:
      "Stand behind a chair, holding the back with both hands. Cross one ankle over the opposite knee, and gently bend your standing leg to feel a stretch through your hip, then switch sides.",
    difficulty: 3,
    durationEstimateSeconds: 60,
    equipmentRequired: ["chair"],
    environmentTags: ["has_chair"],
    bodyFocus: ["lower_body"],
    modifications:
      "Easier: skip the bend and just hold the ankle-over-knee position lightly. Harder: bend a little deeper. Seated alternative: sit and cross one ankle over the opposite knee, gently pressing the raised knee down.",
  },
  {
    id: "gentle-seated-spinal-twist",
    name: "Gentle Seated Spinal Twist",
    description:
      "Sit sideways in a chair, feet flat on the floor. Hold the back of the chair with both hands and gently twist your torso toward it, looking over your shoulder. Return to center and repeat on the other side.",
    difficulty: 2,
    durationEstimateSeconds: 60,
    equipmentRequired: ["chair"],
    environmentTags: ["has_chair", "small_space"],
    bodyFocus: ["core"],
    modifications:
      "Easier: twist a smaller amount and skip looking over your shoulder. Harder: hold the twist for a few extra breaths. Already seated.",
  },
];
