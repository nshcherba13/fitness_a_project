<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" href="{{ asset('images/icon.ico') }}" type="image/x-icon">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
        integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A=="
        crossorigin="anonymous" referrerpolicy="no-referrer">
    <link rel="stylesheet" href="{{ asset('css/homepage_style.css') }}">
    <link rel="stylesheet" href="{{ asset('css/fonts.css') }}">
    <title>A* Training Club</title>
</head>

<body>
    <!-- Header -->
    <header>
        <div class="container">
            <div class="container bg-gray">
                <div class="row align-items-center text-center text-md-start">
                    <div
                        class="col-12 col-md-4 d-flex justify-content-center mt-2 mb-2 justify-content-md-start mb-md-0">
                        <img src="{{ asset('images/logo_big.png') }}" alt="Club Logo" class="img-fluid club-logo">
                    </div>
                    <div
                        class="col-12 col-md-8 d-flex flex-column flex-md-row align-items-center align-items-md-end justify-content-center justify-content-md-end">
                        <a href="#trainings" class="btn head-btn mb-2 mb-md-0">Trainings</a>
                        <a href="#trainers" class="btn head-btn mx-md-2 mb-2 mb-md-0">Trainers</a>
                        <a href="#menu" class="btn head-btn mx-md-2 mb-2 mb-md-0">Menu options</a>
                        <a href="#subscription" class="btn head-btn mx-md-2 mb-2 mb-md-0">Pricing</a>
                    </div>
                </div>
            </div>
        </div>
    </header>

    <!-- Banner -->
    <section class="banner">
        <div class="container-fluid h-100">
            <div class="row h-100">
                <div class="col-md-6 d-flex d-md-block"></div>
                <div
                    class="col-12 col-md-6 d-flex flex-column justify-content-between align-items-center align-items-md-end">
                    <div class="d-flex flex-column justify-content-center align-items-center flex-grow-1 w-100">
                        <p class="text-banner text-center header-white slogan">Welcome to the club,<br> <span
                                class="buddy">Buddy</span></p>
                    </div>
                    <div
                        class="d-flex flex-column flex-md-row gap-3 mb-4 w-100 justify-content-center justify-content-md-end">
                        <a href="#subscription" class="btn club-btn w-100 signin-btn">Become a member</a>
                        <a href="" class="btn club-btn w-100 login-btn">Log In</a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Trainings -->
    <section class="trainings bg-gray" id="trainings">
        <div class="container">
            <div class="row d-flex justify-content-center">
                <div class="col-12 text-center mb-5 mt-5 header-white p-1">
                    <h1>50+ workout programs</h1>
                </div>
            </div>
            <div class="row">
                <div class="col-12 col-md-6 mb-5">
                    <div class="training bg-white rounded p-5 text-center">
                        <img src="{{ asset('images/training/example1.webp') }}" alt="Power Ropes Blast"
                            class="img-fluid mb-4 mt-2 rounded">
                        <h2 class="mb-2">Power Ropes Blast</h2>
                        <p>Ignite your core and upper body strength with an intense battle ropes session. Feel the burn
                            as you push your endurance to new heights, gaining explosive power and stamina!</p>
                        <button type="button" class="btn club-btn readmore-btn w-100" data-bs-toggle="modal"
                            data-bs-target="#powerRopes">
                            Learn more
                        </button>
                        <div class="modal fade" id="powerRopes" tabindex="-1" aria-hidden="true">
                            <div class="modal-dialog">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title">Power Ropes Blast</h5>
                                        <button type="button" class="btn-close" data-bs-dismiss="modal"
                                            aria-label="Close"></button>
                                    </div>
                                    <div class="modal-body">
                                        <iframe width="100%" height="315"
                                            src="https://www.youtube.com/embed/1gNMRV1GUFg" title="YouTube video player"
                                            frameborder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                            referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                                        <p>This beginner-friendly battle rope workout is designed to be performed with a
                                            lightweight rope. After completing one round, additional iterations can be
                                            added for a more intense session, allowing for a progressively challenging
                                            workout experience.</p>
                                        <p>Battle rope training provides numerous benefits, including enhanced
                                            cardiovascular endurance, increased muscular strength, improved core
                                            stability, and heightened calorie burn. It is a versatile and efficient
                                            full-body workout that engages multiple muscle groups simultaneously while
                                            improving coordination. Adaptable to various fitness levels, it offers a
                                            comprehensive exercise regimen suitable for diverse fitness goals.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-md-6 mb-5">
                    <div class="training bg-white rounded p-5 text-center">
                        <img src="{{ asset('images/training/example2.webp') }}" alt="Partner Push Challenge"
                            class="img-fluid mb-4 mt-2 rounded">
                        <h2 class="mb-2">Partner Push Challenge</h2>
                        <p>Team up for a dynamic full-body workout! Challenge each other’s strength, coordination, and
                            balance as you push through synchronized partner drills that build both muscle and teamwork!
                        </p>
                        <button type="button" class="btn club-btn readmore-btn w-100" data-bs-toggle="modal"
                            data-bs-target="#pushupChallenge">
                            Learn more
                        </button>
                        <div class="modal fade" id="pushupChallenge" tabindex="-1" aria-hidden="true">
                            <div class="modal-dialog">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title">Partner Push Challenge</h5>
                                        <button type="button" class="btn-close" data-bs-dismiss="modal"
                                            aria-label="Close"></button>
                                    </div>
                                    <div class="modal-body">
                                        <iframe width="100%" height="315"
                                            src="https://www.youtube.com/embed/Jf5_PJCFs-g" title="YouTube video player"
                                            frameborder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                            referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                                        <p>Transform your body in just 30 days with this ultimate push-up
                                            challenge! The goal is to complete approximately <strong>170
                                                push-ups per session</strong>, varying your movements to target
                                            different muscle groups and prevent monotony. Here’s how to
                                            structure your workout for maximum results:</p>
                                        <ul>
                                            <li><strong>Vary Your Arm Position</strong>: Mix it up with narrow,
                                                wide, and staggered push-ups to engage your chest, shoulders,
                                                and triceps differently.</li>
                                            <li><strong>Incorporate Incline and Decline Push-Ups</strong>: Use a
                                                bench, chair, or step to perform incline and decline variations,
                                                targeting different angles of your chest.</li>
                                            <li><strong>Add Pause Push-Ups</strong>: Lower yourself slowly, hold
                                                at the bottom for a few seconds, and then push back up to
                                                increase time under tension and build strength.</li>
                                            <li><strong>Explosive Push-Ups</strong>: Add explosive push-ups,
                                                like clap push-ups, to build power and burn out your chest and
                                                triceps.</li>
                                        </ul>
                                        <p>Challenge yourself to complete this dynamic workout daily for 30 days
                                            and see how your body transforms. Stay consistent, push your limits,
                                            and enjoy the progress!</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>


    <!-- Trainers -->
    <section class="trainers bg-black" id="trainers">
        <div class="container">
            <div class="row d-flex justify-content-center">
                <div class="col-12 text-center mb-5 mt-5 header-white p-1">
                    <h1>trust our professional trainers</h1>
                </div>
            </div>
            <div class="row d-flex justify-content-center">
                <!-- Trainer 1 -->
                <div class="col-xl-3 col-md-6 mb-5 d-flex flex-column align-items-center">
                    <div
                        class="training bg-black rounded cr p-4 text-center d-flex flex-column align-items-center w-100 h-100">
                        <img src="{{ asset('images/trainer/anatoly.jpg') }}" alt="Trainer Anatoly Cleaner"
                            class="img-fluid mb-3 mt-2 rounded-circle trainer-foto">
                        <h2 class="text-white mb-3">Anatoly Cleaner</h2>
                        <p class="text-white mb-3">Our Janitor with the 30-pound mutt and Instagram star</p>
                        <button type="button" class="btn club-btn readmore-tr-btn align-items-center w-100 mt-auto"
                            data-bs-toggle="modal" data-bs-target="#anatoly">
                            Learn more
                        </button>
                        <div class="modal fade" id="anatoly" tabindex="-1" aria-hidden="true">
                            <div class="modal-dialog">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title">Anatoly "The Cleaner"</h5>
                                        <button type="button" class="btn-close" data-bs-dismiss="modal"
                                            aria-label="Close"></button>
                                    </div>
                                    <div class="modal-body">
                                        <ul>
                                            <li><strong>Master of Sports of International Class</strong> in deadlift.
                                                Yes, the man can deadlift like a machine.</li>
                                            <li><strong>Master of Sports</strong> in powerlifting. He’s got the
                                                credentials to back up the madness.</li>
                                            <li>Pulls off <strong>100kg one-handed snatches</strong> like it’s no big
                                                deal.</li>
                                            <li>Effortlessly performs <strong>muscle-ups without touching the
                                                    bar</strong>, defying the laws of physics.</li>
                                            <li>Became a <strong>YouTube sensation</strong> by dressing as a janitor,
                                                trolling gym-goers, and casually destroying their egos.</li>
                                            <li>Started his journey in 2018, training in a backyard in a remote
                                                village - proof that greatness can come from anywhere.</li>
                                            <li>Turned his YouTube channel into a viral hit with hilarious and
                                                jaw-dropping content.</li>
                                            <li>Weighs only 81kg but lifts weights that make 120kg gym bros cry
                                                internally.</li>
                                            <li>Currently creating legendary content in the UAE, showing that even a
                                                "janitor" can dominate any gym.</li>
                                            <li>Brings audiences to tears—either from laughter or pure awe at his hybrid
                                                strength and technique.</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Trainer 2 -->
                <div class="col-xl-3 col-md-6 mb-5 d-flex flex-column align-items-center">
                    <div
                        class="training bg-black rounded cr p-4 text-center d-flex flex-column align-items-center w-100 h-100">
                        <img src="{{ asset('images/trainer/luis_benzin.jpg') }}" alt="Trainer Luis Benzin"
                            class="img-fluid mb-3 mt-2 rounded-circle trainer-foto">
                        <h2 class="text-white mb-3">Luis Benzin</h2>
                        <p class="text-white mb-3">Our gym coach who fuels your workouts with diesel-level intensity</p>
                        <button type="button" class="btn club-btn readmore-tr-btn align-items-center w-100 mt-auto"
                            data-bs-toggle="modal" data-bs-target="#benzin">
                            Learn more
                        </button>
                        <div class="modal fade" id="benzin" tabindex="-1" aria-hidden="true">
                            <div class="modal-dialog">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title">Luis Benzin</h5>
                                        <button type="button" class="btn-close" data-bs-dismiss="modal"
                                            aria-label="Close"></button>
                                    </div>
                                    <div class="modal-body">
                                        <ul>
                                            <li><strong>Master of Family Values:</strong> Teaches that nothing is more
                                                important than family—even when lifting weights.</li>
                                            <li><strong>Champion of Nitrous-Fueled Workouts:</strong> Known for
                                                explosive strength training routines that push you past the limits.</li>
                                            <li><strong>Deadlift King:</strong> Can lift "a quarter-mile" of weight at a
                                                time. No, seriously, he’s that strong.</li>
                                            <li><strong>Bench Press Brotherhood:</strong> Believes every rep builds not
                                                just muscle, but trust and loyalty.</li>
                                            <li><strong>High-Speed HIIT Specialist:</strong> Combines cardio and
                                                strength training with the speed of a street race.</li>
                                            <li><strong>Core Stability Expert:</strong> Achieves insane stability, even
                                                while hanging from moving cars or dangling weights mid-air.</li>
                                            <li><strong>Unbreakable Grip Strength:</strong> Can hold onto
                                                anything—barbells, cars, or even a collapsing parking garage.</li>
                                            <li><strong>Charismatic Gym Leader:</strong> Inspires everyone around him to
                                                believe they can lift the "impossible" weight.</li>
                                            <li><strong>Battle Rope Hero:</strong> Uses battle ropes like they’re engine
                                                cables—gets the job done, no matter the weight.</li>
                                            <li><strong>Legend of Never Skipping Leg Day:</strong> His power comes from
                                                the ground up, proving you can’t outrun responsibility or squats.</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Trainer 3 -->
                <div class="col-xl-3 col-md-6 mb-5 d-flex flex-column align-items-center">
                    <div
                        class="training bg-black rounded cr p-4 text-center d-flex flex-column align-items-center w-100 h-100">
                        <img src="{{ asset('images/trainer/egg.webp') }}" alt="Trainer Dwight Jackson"
                            class="img-fluid mb-3 mt-2 rounded-circle trainer-foto">
                        <h2 class="text-white mb-3">Dwight Jackson</h2>
                        <p class="text-white mb-3">A wrestling legend, built like a rock but smooth as an egg</p>
                        <button type="button" class="btn club-btn readmore-tr-btn align-items-center w-100 mt-auto"
                            data-bs-toggle="modal" data-bs-target="#egg">
                            Learn more
                        </button>
                        <div class="modal fade" id="egg" tabindex="-1" aria-hidden="true">
                            <div class="modal-dialog">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title">Dwight "The Egg" Jackson</h5>
                                        <button type="button" class="btn-close" data-bs-dismiss="modal"
                                            aria-label="Close"></button>
                                    </div>
                                    <div class="modal-body">
                                        <ul>
                                            <li><strong>Lord of the Iron Paradise:</strong> Created a gym so epic it’s
                                                basically a shrine to gains.</li>
                                            <li><strong>Master of the Cheat Meal:</strong> Known for cheat days that
                                                could feed an entire football team.</li>
                                            <li><strong>Boulder Shoulder Builder:</strong> His deltoids are basically
                                                mountain ranges, inspiring lifters everywhere.</li>
                                            <li><strong>Deadlift Titan:</strong> Moves weights so heavy, they probably
                                                have their own gravity field.</li>
                                            <li><strong>Leg Day Enthusiast:</strong> Squats so deep he finds oil at the
                                                bottom.</li>
                                            <li><strong>Cardio Crusher:</strong> Can outrun a stampede while carrying a
                                                chain around his neck—because why not?</li>
                                            <li><strong>Endurance Icon:</strong> Films blockbuster movies all day, then
                                                lifts for hours—sleep is optional.</li>
                                            <li><strong>Motivational Beast:</strong> His Instagram captions alone can
                                                make you want to PR your bench press.</li>
                                            <li><strong>Core Destroyer:</strong> Abs so solid they could stop a
                                                sledgehammer mid-swing.</li>
                                            <li><strong>Flexing Phenomenon:</strong> Makes bicep curls look like a
                                                religious experience.</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Trainer 4 -->
                <div class="col-xl-3 col-md-6 mb-5 d-flex flex-column align-items-center">
                    <div
                        class="training bg-black rounded cr p-4 text-center d-flex flex-column align-items-center w-100 h-100">
                        <img src="{{ asset('images/trainer/johncena.jpg') }}" alt="Trainer Chong Xina"
                            class="img-fluid mb-3 mt-2 rounded-circle trainer-foto">
                        <h2 class="text-white mb-3">Chong Xina</h2>
                        <p class="text-white mb-3">A wrestling champ fueled by ice cream and unstoppable moves</p>
                        <button type="button" class="btn club-btn readmore-tr-btn align-items-center w-100 mt-auto"
                            data-bs-toggle="modal" data-bs-target="#xina">
                            Learn more
                        </button>
                        <div class="modal fade" id="xina" tabindex="-1" aria-hidden="true">
                            <div class="modal-dialog">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title">Chong Xina</h5>
                                        <button type="button" class="btn-close" data-bs-dismiss="modal"
                                            aria-label="Close"></button>
                                    </div>
                                    <div class="modal-body">
                                        <ul>
                                            <li><strong>Invisible Gains Expert:</strong> Trains so hard that no one can
                                                see him—or his limits.</li>
                                            <li><strong>Five-Knuckle Push-Up Specialist:</strong> Pushes the floor down
                                                instead of pushing himself up.</li>
                                            <li><strong>Never Give Up Champion:</strong> Brings his iconic mantra to
                                                every workout, ensuring you never quit mid-rep.</li>
                                            <li><strong>Powerlifting Prodigy:</strong> Lifts weights heavier than his
                                                entire fanbase combined.</li>
                                            <li><strong>Core Commander:</strong> Abs so defined they could double as a
                                                roadmap to success.</li>
                                            <li><strong>Tag-Team Trainer:</strong> Believes that teamwork and spotting
                                                are key to smashing PRs.</li>
                                            <li><strong>Bench Press Warrior:</strong> Can bench press weights so heavy
                                                they need their own theme music.</li>
                                            <li><strong>Squat Superstar:</strong> His squats go so low, they hit rock
                                                bottom—literally.</li>
                                            <li><strong>Cardio King:</strong> Runs faster than his opponents' egos can
                                                recover from a match.</li>
                                            <li><strong>Motivational Maestro:</strong> Inspires gym-goers with speeches
                                                that could make barbells cry tears of joy.</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Menu -->
    <section class="menu bg-gray" id="menu">
        <div class="container">
            <div class="row d-flex justify-content-center">
                <div class="col-12 text-center mb-5 mt-5 header-white">
                    <h1>100+ delicious recipes</h1>
                </div>
            </div>
            <div class="row">
                <!-- Menu Item 1 -->
                <div class="col-xl-4 col-md-6 col-sm-12 mb-5 mt-2 d-flex justify-content-center">
                    <div class="card-flip">
                        <div class="card-inner-flip">
                            <div class="card-front-flip text-center">
                                <img src="{{ asset('images/menu/scrumble.png') }}" alt="Egg and Veggie Scramble"
                                    class="img-fluid rounded-top">
                                <p class="mt-4 p-3">Time to refuel and recover!</p>
                            </div>
                            <div class="card-back-flip">
                                <p class="text-center p-3"><strong>Egg and Veggie Scramble</strong><br>A balanced
                                    breakfast
                                    option high in protein, great for building muscle and staying satisfied.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Menu Item 2 -->
                <div class="col-xl-4 col-md-6 col-sm-12 mb-5 mt-2 d-flex justify-content-center">
                    <div class="card-flip">
                        <div class="card-inner-flip">
                            <div class="card-front-flip text-center">
                                <img src="{{ asset('images/menu/quinoa_salad.png') }}" alt="Quinoa Salad with Avocado"
                                    class="img-fluid rounded-top">
                                <p class="mt-4 p-3">Light and fresh! Ready to keep it lean?</p>
                            </div>
                            <div class="card-back-flip">
                                <p class="text-center p-3"><strong>Quinoa Salad with Avocado</strong><br>A fiber-rich,
                                    low-calorie meal, ideal for weight management and a quick energy boost.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Menu Item 3 -->
                <div class="col-xl-4 col-md-6 col-sm-12 mb-5 mt-2 d-flex justify-content-center">
                    <div class="card-flip">
                        <div class="card-inner-flip">
                            <div class="card-front-flip text-center">
                                <img src="{{ asset('images/menu/chia_pudding.png') }}"  alt="Chia Pudding with Fresh Fruit"
                                    class="img-fluid rounded-top">
                                <p class="mt-4 p-3">Need a guilt-free treat? Indulge without the extra calories!</p>
                            </div>
                            <div class="card-back-flip">
                                <p class="text-center p-3"><strong>Chia Pudding with Fresh Fruit</strong><br>A
                                    low-calorie
                                    dessert full of fiber and antioxidants to support weight loss goals.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Menu Item 4 -->
                <div class="col-xl-4 col-md-6 col-sm-12 mb-5 mt-2 d-flex justify-content-center">
                    <div class="card-flip">
                        <div class="card-inner-flip">
                            <div class="card-front-flip text-center">
                                <img src="{{ asset('images/menu/grilled_salmon.png') }}" alt="Grilled Salmon with Steamed Veggies"
                                    class="img-fluid rounded-top">
                                <p class="mt-4 p-3">Feeling hungry? Let’s fuel up the right way!</p>
                            </div>
                            <div class="card-back-flip">
                                <p class="text-center p-3"><strong>Grilled Salmon with Steamed Veggies</strong><br>A
                                    nutrient-packed meal that supports weight loss and keeps you satisfied with healthy
                                    fats and protein.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Menu Item 5 -->
                <div class="col-xl-4 col-md-6 col-sm-12 mb-5 mt-2 d-flex justify-content-center">
                    <div class="card-flip">
                        <div class="card-inner-flip">
                            <div class="card-front-flip text-center">
                                <img src="{{ asset('images/menu/zucchini_pasta.png') }}" alt="Zucchini Noodles with Pesto"
                                    class="img-fluid rounded-top">
                                <p class="mt-4 p-3">Light but satisfying? You’ve got it!</p>
                            </div>
                            <div class="card-back-flip">
                                <p class="text-center p-3"><strong>Zucchini Noodles with Pesto</strong><br>A low-carb,
                                    fresh, and flavorful meal that supports weight loss without skimping on taste.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Menu Item 6 -->
                <div class="col-xl-4 col-md-6 col-sm-12 mb-5 mt-2 d-flex justify-content-center">
                    <div class="card-flip">
                        <div class="card-inner-flip">
                            <div class="card-front-flip text-center">
                                <img src="{{ asset('images/menu/rice_bowl.png') }}" alt="Spicy Chicken Rice Bowl"
                                    class="img-fluid rounded-top">
                                <p class="mt-4 p-3">Ready for a flavorful boost? Fuel up with this hearty bowl!</p>
                            </div>
                            <div class="card-back-flip">
                                <p class="text-center p-3"><strong>Spicy Chicken Rice Bowl</strong><br>A
                                    protein-packed meal featuring tender chicken, colorful veggies, and savory rice,
                                    perfect for muscle-building and recovery.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>


    <!-- Pricing -->
    <section class="subscription" id="subscription">
        <div class="col-12 text-center mb-5 mt-5 p-1">
            <h1>choose your pricing plan</h1>
        </div>
        <div class="container text-center">
            <div class="row">
                <div class="col-xl-4 col-md-6 col-sm-12 mb-5 mt-2">
                    <div class="card shadow-lg card-bronze">
                        <div class="card-header">
                            <h2>Bronze</h2>
                            <p>Simple guidance to start</p>
                        </div>
                        <div class="card-body">
                            <div class="price">0€<small class="text-muted">/mo</small></div>
                            <ul class="list-unstyled mt-4 mb-4 benefits">
                                <li class="mb-2 mt-2">One essential fitness plan</li>
                                <li class="mb-2 mt-2">One essential nutrition plan</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="col-xl-4 col-md-6 col-sm-12 mb-5 mt-2">
                    <div class="card shadow-lg card-silver">
                        <div class="card-header">
                            <h2>Silver</h2>
                            <p>More variety and flexibility</p>
                        </div>
                        <div class="card-body">
                            <div class="price">19€<small class="text-muted">/mo</small></div>
                            <ul class="list-unstyled mt-4 mb-4 benefits">
                                <li class="mb-2 mt-2">Unlimited fitness plans</li>
                                <li class="mb-2 mt-2">Unlimited nutrition plans</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="col-xl-4 col-md-6 col-sm-12 mb-5 mt-2">
                    <div class="card shadow-lg card-gold">
                        <div class="card-header">
                            <h2>Gold</h2>
                            <p>Fully personalized experience</p>
                        </div>
                        <div class="card-body">
                            <div class="price">29€<small class="text-muted">/mo</small></div>
                            <ul class="list-unstyled mt-4 mb-4 benefits">
                                <li class="mb-2 mt-2">Direct chat with trainers</li>
                                <li class="mb-2 mt-2">Unlimited fitness plans</li>
                                <li class="mb-2 mt-2">Unlimited nutrition plans</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div class="d-flex justify-content-center mb-5">
                <a href="" class="btn club-btn readmore-btn mt-4 w-50">Subscribe now</a>
            </div>
        </div>
    </section>


    <footer class="container-fluid border-top lh-sm pb-1 footer-container">
        <p class="text-center footer-slogan fs-1 m-0 mt-3">STÄRKE ZÄHLT</p>
        <p class="text-center footer-slogan fs-1 m-0">DER REST IST EGAL!</p>
        <p class="text-center footer-hashtag fs-1"><span class="bg-danger px-2"> #KraftIstAlles </span></p>
        <p class="text-center my-4">
            <a href="facebook.com" class="text-reset text-decoration-none mx-2"><i
                    class="fa-brands fa-facebook fa-2xl footer-link-text"></i></a>
            <a href="instagram.com" class="text-reset text-decoration-none mx-2"><i
                    class="fa-brands fa-instagram fa-2xl footer-link-text"></i></a>
            <a href="tiktok.com" class="text-reset text-decoration-none mx-2 "><i
                    class="fa-brands fa-tiktok fa-2xl footer-link-text"></i></a>
        </p>
        <p class="text-center font-regular fs-6">
            <a href="#" class="text-decoration-none text-reset"><span class="footer-link-text">Datenshutz</span></a> |
            <a href="#" class="text-decoration-none text-reset"><span class="footer-link-text">Impressum</span></a> |
            <a href="#" class="text-decoration-none text-reset"><span class="footer-link-text">AGB</span></a> |
            <a href="#" class="text-decoration-none text-reset"><span class="footer-link-text">Kontakt</span></a>
        </p>
        <p class="text-center fs-6">2024 © Team A* DevTeam</p>

    </footer>


    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
        crossorigin="anonymous"></script>
</body>

</html>