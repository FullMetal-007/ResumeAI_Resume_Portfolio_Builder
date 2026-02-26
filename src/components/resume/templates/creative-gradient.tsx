import { ResumeData, ResumeConfig } from "@/types/resume";
import { formatDate } from "@/lib/utils";

interface Props {
    data: ResumeData;
    config: ResumeConfig;
    scale?: number;
}

export function CreativeGradientTemplate({ data, config, scale = 1 }: Props) {
    const { personalInfo: p, experience, education, skills, projects, sections } = data;

    return (
        <div
            className="bg-white text-gray-900"
            style={{
                width: 794,
                minHeight: 1123,
                transform: `scale(${scale})`,
                transformOrigin: "top left",
                fontFamily: config.fontFamily || "Inter, sans-serif",
                fontSize: config.fontSize === "sm" ? 12 : config.fontSize === "lg" ? 15 : 13,
            }}
        >
            {/* Gradient Header */}
            <div
                className="px-10 py-10 text-white relative overflow-hidden"
                style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)" }}
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                <div className="relative z-10">
                    <h1 className="text-4xl font-black tracking-tight mb-1">{p.fullName || "Your Name"}</h1>
                    <div className="flex flex-wrap gap-3 text-sm text-white/80 mt-2">
                        {p.email && <span>✉ {p.email}</span>}
                        {p.phone && <span>📞 {p.phone}</span>}
                        {p.location && <span>📍 {p.location}</span>}
                        {p.linkedin && <span>🔗 {p.linkedin}</span>}
                        {p.github && <span>⌨ {p.github}</span>}
                    </div>
                </div>
            </div>

            <div className="px-10 py-8 space-y-6">
                {/* Summary */}
                {sections.showSummary && p.summary && (
                    <div>
                        <h2 className="text-sm font-black uppercase tracking-widest text-purple-600 mb-2">About Me</h2>
                        <p className="text-xs text-gray-700 leading-relaxed border-l-4 border-purple-200 pl-4">{p.summary}</p>
                    </div>
                )}

                {/* Skills — pill style */}
                {sections.showSkills && skills.length > 0 && (
                    <div>
                        <h2 className="text-sm font-black uppercase tracking-widest text-purple-600 mb-3">Skills</h2>
                        {skills.map((group) => (
                            <div key={group.id} className="mb-2">
                                <p className="text-xs font-bold text-gray-600 mb-1.5">{group.category}</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {group.items.map((skill) => (
                                        <span key={skill} className="text-xs px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 font-medium">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Experience */}
                {sections.showExperience && experience.length > 0 && (
                    <div>
                        <h2 className="text-sm font-black uppercase tracking-widest text-purple-600 mb-3">Experience</h2>
                        {experience.map((exp) => (
                            <div key={exp.id} className="mb-5 relative pl-5">
                                <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-purple-500" />
                                <div className="absolute left-1 top-3.5 bottom-0 w-px bg-purple-100" />
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">{exp.position}</p>
                                        <p className="text-xs font-semibold text-purple-600">{exp.company}</p>
                                    </div>
                                    <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full whitespace-nowrap ml-2">
                                        {formatDate(exp.startDate)} – {exp.current ? "Present" : formatDate(exp.endDate)}
                                    </span>
                                </div>
                                <ul className="mt-2 space-y-1">
                                    {exp.description.map((b, i) => (
                                        <li key={i} className="text-xs text-gray-700 flex gap-2">
                                            <span className="text-purple-400 flex-shrink-0">→</span>{b}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                )}

                <div className="grid grid-cols-2 gap-6">
                    {/* Education */}
                    {sections.showEducation && education.length > 0 && (
                        <div>
                            <h2 className="text-sm font-black uppercase tracking-widest text-purple-600 mb-3">Education</h2>
                            {education.map((edu) => (
                                <div key={edu.id} className="mb-3 p-3 bg-purple-50 rounded-xl">
                                    <p className="text-xs font-bold text-gray-900">{edu.institution}</p>
                                    <p className="text-xs text-gray-600">{edu.degree} · {edu.field}</p>
                                    <p className="text-xs text-gray-400">{formatDate(edu.startDate)} – {formatDate(edu.endDate)}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Projects */}
                    {sections.showProjects && projects.length > 0 && (
                        <div>
                            <h2 className="text-sm font-black uppercase tracking-widest text-purple-600 mb-3">Projects</h2>
                            {projects.map((proj) => (
                                <div key={proj.id} className="mb-3 p-3 bg-gray-50 rounded-xl">
                                    <p className="text-xs font-bold text-gray-900">{proj.name}</p>
                                    <p className="text-xs text-gray-600">{proj.description}</p>
                                    <p className="text-xs text-purple-500 mt-0.5">{proj.technologies.join(" · ")}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
